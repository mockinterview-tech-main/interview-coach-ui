import jwt from 'jsonwebtoken';

export const decodeJwt = (token: string): any => {
    try {
        const decoded = jwt.decode(token);
        return decoded;
    } catch (e) {
        console.error('Failed to decode token:', e);
        return null;
    }
}

export const mintJwt = (data: string, secret: string): string => {
    return jwt.sign(data, secret, {
        expiresIn: '1h',
        
    })
}