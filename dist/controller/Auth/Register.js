"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Register = void 0;
const zod_1 = require("zod");
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const uuid_1 = require("uuid");
const RegisterSchema = zod_1.z.object({
    companyName: zod_1.z.string().nonempty(),
    ownerName: zod_1.z.string().nonempty(),
    rollNo: zod_1.z.string().nonempty(),
    accessCode: zod_1.z.string().nonempty(),
});
function generateRandomString(length = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
// Example output: "HVIQBVbqmTGEmaED"
const generateClientandClientSecret = () => {
    const clientId = (0, uuid_1.v4)();
    const clientSecret = generateRandomString();
    return { clientId, clientSecret };
};
exports.Register = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paresedBody = RegisterSchema.safeParse(req.body);
    if (!paresedBody.success) {
        res.status(400).json({
            success: false,
            message: paresedBody.error.errors[0].message
        });
        return;
    }
    const { clientId, clientSecret } = generateClientandClientSecret();
    res.status(200).json(Object.assign(Object.assign({}, paresedBody.data), { clientId,
        clientSecret }));
}));
