type QueryParams = { [key: string]: any };

interface QueryBuilder {
    query: string[];
    bindVars: QueryParams;
}

export const initialBuilderState: QueryBuilder = {
    query: [],
    bindVars: {},
};

export const forIn = (builder: QueryBuilder, collection: string, alias: string): QueryBuilder => ({
    ...builder,
    query: [...builder.query, `FOR ${alias} IN ${collection}`],
});

export const mergeExpr = (builder: QueryBuilder, expression: ExpressionInput): QueryBuilder => ({
    ...builder,
    query: [...builder.query, `${typeof expression === 'function' ? (expression as () => string)() : expression}`],
});

export const limitExpr = (builder: QueryBuilder, offset: string, limit: string) => ({
    ...builder,
    query: [
        ...builder.query,
        `LIMIT ${offset}, ${limit}`
    ],
})

export const filter = (builder: QueryBuilder, condition: string): QueryBuilder => ({
    ...builder,
    query: [...builder.query, `FILTER ${condition}`],
});


export const filterGroup = (builder: QueryBuilder, conditions: string[]): QueryBuilder => ({
    ...builder,
    query: [...builder.query, `FILTER ${conditions.join(' && ')}`],
});


export const limit = (builder: QueryBuilder, count: number): QueryBuilder => ({
    ...builder,
    query: [...builder.query, `LIMIT ${count}`],
});

type ExpressionInput = string | (() => string);

export const returnExpr = (builder: QueryBuilder, expression: ExpressionInput): QueryBuilder => ({
    ...builder,
    query: [...builder.query, `RETURN ${typeof expression === 'function' ? (expression as () => string)() : expression}`],
});

export const bind = (builder: QueryBuilder, variable: string, value: any): QueryBuilder => ({
    ...builder,
    bindVars: { ...builder.bindVars, [variable]: value },
});

export const build = (builder: QueryBuilder): { query: string; bindVars: QueryParams } => {
    const query = builder.query.join(' '); // Concatenate query parts into a single string
    return {
        query,
        bindVars: builder.bindVars,
    };
};

export const exists = (builder: QueryBuilder, collection: string, attribute: string, valueVar: string): QueryBuilder => {
    const condition = `FOR doc IN ${collection} FILTER doc.${attribute} == @${valueVar} LIMIT 1 RETURN 1`;
    return {
        ...builder,
        query: [...builder.query, `RETURN EXISTS(${condition})`],
    };
};

export const update = (builder: QueryBuilder, alias: string, collection: string, updateExpression: string): QueryBuilder => ({
    ...builder,
    query: [...builder.query, `UPDATE ${alias} WITH ${updateExpression} in ${collection}`],
});

export const create = (builder: QueryBuilder, collection: string): QueryBuilder => ({
    ...builder,
    query: [...builder.query, `INSERT @body INTO ${collection}`],
});

export const bulkCreate = (builder: QueryBuilder, bulkData: string,collection: string): QueryBuilder => ({
    ...builder,
    query: [...builder.query, `FOR data IN ${bulkData} INSERT data INTO ${collection}`],
});

export const remove = (builder: QueryBuilder, alias: string, collection: string): QueryBuilder => ({
    ...builder,
    query: [...builder.query, `REMOVE ${alias} IN ${collection}`],
});

export const wordMatch = (builder: QueryBuilder, field: string, text: string): QueryBuilder => ({
    ...builder,
    query: [...builder.query, `FILTER ANALYZER(${field} LIKE CONCAT("${text}", '%'), 'textAnalyzer')`],
});

export const forMultipleJoin = (
    builder: QueryBuilder,
    initialCollection: string,
    alias: string,
    joins: { [key: string]: { collection: string, field: string, alias: string } }
): QueryBuilder => {
    const joinQueries = Object.entries(joins).map(([joinField, joinDetails]) =>
        `LET ${joinField}Details = (FOR ${joinDetails.alias} IN ${joinDetails.collection} FILTER ${joinDetails.alias}._key IN ${alias}.${joinDetails.field} RETURN ${joinDetails.alias})`
    );

    return {
        ...builder,
        query: [
            ...builder.query,
            `FOR ${alias} IN ${initialCollection}`,
            ...joinQueries
        ]
    };
};

type JoinType = 'oneToOne' | 'manyToMany';

type JoinField = {
    fieldName: string;
    targetCollection: string;
    joinType: JoinType;
};

export const joinMultiple = (
    builder: QueryBuilder,
    alias: string,
    joinFields: JoinField[]
): QueryBuilder => {
    let updatedBuilder = { ...builder };

    for (const fieldObj of joinFields) {
        const joinAlias = `${alias}_${fieldObj.fieldName}`;

        let joinQuery: string;

        if (fieldObj.joinType === 'manyToMany') {
            joinQuery = `LET ${joinAlias} = (FOR item IN ${fieldObj.targetCollection} FILTER item._key IN ${alias}.${fieldObj.fieldName} RETURN item)`;
        } else if (fieldObj.joinType === 'oneToOne') {
            joinQuery = `LET ${joinAlias} = (FOR item IN ${fieldObj.targetCollection} FILTER item._key == ${alias}.${fieldObj.fieldName} RETURN item)`;
        } else {
            throw new Error(`Unsupported join type: ${fieldObj.joinType}`);
        }

        updatedBuilder = {
            ...updatedBuilder,
            query: [
                ...updatedBuilder.query,
                joinQuery
            ],
        };
    }

    return updatedBuilder;
};


type KeyInput = string | string[];
interface CheckCriterion {
    collectionName: string;
    fieldName: string;
    relationType: 'array' | 'direct';
    keys: KeyInput;  // keys to be checked
}

export const checkKeysInFieldsDynamic = (
    builder: QueryBuilder,
    criteria: CheckCriterion[]
): QueryBuilder => {
    const filters: string[] = [];

    criteria.forEach(({ collectionName, fieldName, relationType, keys }) => {
        const keyArrayVarName = `${fieldName}KeyArray`;
        builder.bindVars[keyArrayVarName] = Array.isArray(keys) ? keys : [keys];

        if (relationType === 'array') {
            filters.push(`ANY topicKey IN doc.${fieldName} SATISFIES topicKey IN @${keyArrayVarName}`);
        } else if (relationType === 'direct') {
            filters.push(`FOR item IN ${collectionName} FILTER item._key == doc.${fieldName} && item._key IN @${keyArrayVarName} RETURN true`);
        }
    });

    const combinedFilter = filters.join(' OR ');

    return {
        ...builder,
        query: [
            ...builder.query,
            `FOR doc IN ${criteria[0].collectionName}`,
            `FILTER ${combinedFilter}`,
            `RETURN doc`
        ]
    };
};  // there is some issue in this function





// Usage:
// const COL = { users: 'users' };
// const builder = build(
//     returnExpr(
//         limit(
//             filter(
//                 forIn(
//                     initialBuilderState,
//                     COL.users,
//                     'user'
//                 ),
//                 'user.age > @minAge'
//             ),
//             10
//         ),
//         'user'
//     )
// );

// Now bind the variables:
// const finalQuery = {
//     query: builder.query,
//     bindVars: { ...builder.bindVars, minAge: 21 },
// };
