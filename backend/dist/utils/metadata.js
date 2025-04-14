"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchUrlMetadata = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const cheerio = __importStar(require("cheerio"));
/**
 * Fetch metadata from a URL
 */
const fetchUrlMetadata = async (url) => {
    try {
        const response = await (0, node_fetch_1.default)(url);
        const html = await response.text();
        const $ = cheerio.load(html);
        // Extract metadata
        const title = $('title').text() || $('meta[property="og:title"]').attr('content') || '';
        const description = $('meta[name="description"]').attr('content') ||
            $('meta[property="og:description"]').attr('content') || '';
        const favicon = $('link[rel="icon"]').attr('href') ||
            $('link[rel="shortcut icon"]').attr('href') || '';
        const previewImage = $('meta[property="og:image"]').attr('content') || '';
        // Ensure favicon URL is absolute
        const faviconUrl = favicon ? new URL(favicon, url).toString() : '';
        return {
            title,
            description,
            favicon: faviconUrl,
            previewImage,
        };
    }
    catch (error) {
        console.error(`Error fetching metadata for ${url}:`, error);
        return {
            title: '',
            description: '',
            favicon: '',
            previewImage: '',
        };
    }
};
exports.fetchUrlMetadata = fetchUrlMetadata;
//# sourceMappingURL=metadata.js.map