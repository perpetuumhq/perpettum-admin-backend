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

export const filter = (builder: QueryBuilder, condition: string): QueryBuilder => ({
    ...builder,
    query: [...builder.query, `FILTER ${condition}`],
});

export const limit = (builder: QueryBuilder, count: number): QueryBuilder => ({
    ...builder,
    query: [...builder.query, `LIMIT ${count}`],
});

export const returnExpr = (builder: QueryBuilder, expression: string): QueryBuilder => ({
    ...builder,
    query: [...builder.query, `RETURN ${expression}`],
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

// Usage:
const COL = { users: 'users' };
const builder = build(
    returnExpr(
        limit(
            filter(
                forIn(
                    initialBuilderState,
                    COL.users,
                    'user'
                ),
                'user.age > @minAge'
            ),
            10
        ),
        'user'
    )
);

// Now bind the variables:
const finalQuery = {
    query: builder.query,
    bindVars: { ...builder.bindVars, minAge: 21 },
};

console.log(finalQuery);
