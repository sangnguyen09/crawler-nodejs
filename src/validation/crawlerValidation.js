import {check} from 'express-validator';
import { transVatidation } from '../lang/vi';


export const checkDataInput = [
    check('link',transVatidation.not_empty )
    .matches(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/)
]