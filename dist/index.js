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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const absin_points_sdk_1 = __importDefault(require("absin-points-sdk"));
const db_1 = require("./db");
const authMiddleware_1 = require("./authMiddleware");
require('dotenv').config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
const pointsSDK = new absin_points_sdk_1.default(db_1.poolConfig);
// Endpoint to register for an API key
app.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield pointsSDK.registerApiKey();
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}));
// Endpoint to initialize the project
app.post('/initialize', authMiddleware_1.extractApiKey, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield pointsSDK.registerProject(req.apiKey);
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}));
// Distribute points
app.post('/distribute', authMiddleware_1.extractApiKey, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventName, pointsData } = req.body;
    try {
        yield pointsSDK.distribute(req.apiKey, eventName, pointsData);
        res.json({ message: 'Points distributed successfully' });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}));
// Update Event Metadata
app.post('/update_event', authMiddleware_1.extractApiKey, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventName, eventData } = req.body;
    try {
        yield pointsSDK.updateEventMetadata(req.apiKey, eventName, eventData);
        res.json({ message: 'Event updated successfully' });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}));
// Get Event Metadata
app.get('/event/:event_name', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { event_name } = req.params;
    try {
        const eventData = yield pointsSDK.getEventMetadata(event_name);
        const eventRes = eventData.map((event) => {
            const safeEvent = Object.assign({}, event);
            delete safeEvent.api_key;
            return safeEvent;
        });
        res.json(eventRes.pop());
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}));
// Get points for an address
app.get('/points/:address', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { address } = req.params;
    try {
        const points = yield pointsSDK.getPoints(address);
        let totalPoint = 0;
        points.forEach((pointData) => {
            totalPoint += pointData.points;
        });
        res.json(totalPoint);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}));
// Get points for an address filtered by event name
app.get('/points/:address/:eventName', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { address, eventName } = req.params;
    try {
        const points = yield pointsSDK.getPointsByEvent(address, eventName);
        let totalPoint = 0;
        points.forEach((pointData) => {
            totalPoint += pointData.points;
        });
        res.json(totalPoint);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}));
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
