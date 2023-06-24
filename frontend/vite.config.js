const path = require("path");
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            src: path.resolve(__dirname, "./src"),
            component: path.resolve(__dirname, "./src/component"),
            style: path.resolve(__dirname, "./src/style"),
            util: path.resolve(__dirname, "./src/util")
        }
    },
    server: {
        host: "0.0.0.0",
        port: 3000,
        hmr: {
            host: "basecode.test",
            clientPort: 443,
            protocol: "wss"
        }
    },
    plugins: [
        react({
            fastRefresh: process.env.NODE_ENV !== "test"
        })
    ],
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: ["./src/vitest.setup.js"]
    },
    css: {
        preprocessorOptions: {
            less: {
                modifyVars: {
                    "primary-color": "@blue-6"
                },
                javascriptEnabled: true
            }
        }
    }
});