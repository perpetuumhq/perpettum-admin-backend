export default function generateOTP(length: number) {
    const factor = Math.pow(10, length - 1);
    return (Math.floor(factor + Math.random() * 9 * factor));
}