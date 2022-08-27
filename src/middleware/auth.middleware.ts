// const jwt = require('jsonwebtoken');
import jsonwebtoken from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import { Request, Response, NextFunction } from 'express';
dotenv.config()

const JWT_SECRET: string = process.env.JWT_SECRET || 'thisisasecret';


export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const key = process.env.JWT_SECRET;
        let token: string = req.headers.authorization || req.body.token || req.query.token || req.headers['x-access-token'];
        token = token.split(' ')[1];
        if (token) {
         jsonwebtoken.verify(token, JWT_SECRET, (error: any, decoded: any) => {
                if (error) {
                    return res.status(401).send({
                        msg: 'Unauthorized user',
                        error
                    });
                }
                // (<any>req).user = decoded;
                next();
            });
        } else {
            return res.status(401).send({
                msg: 'Access Denied, no token provided'
            });
        }
    } catch (error) {
        res.status(401).json({
            msg: 'No Authorization Header'
        });
    }
};
