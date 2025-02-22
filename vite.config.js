import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";

export default defineConfig({
    plugins: [
        laravel({
            input: [
                "resources/css/bootstrap.min.css",

                "resources/css/app.css",
                "resources/css/main.css",
                "resources/css/theme/core/variables.css",
                "resources/css/theme/core/utility.css",
                "resources/css/theme/core/colors-background.css",
                "resources/css/theme/core/colors-text.css",
                "resources/css/theme/core/typography.css",
                "resources/css/theme/core/borders.css",
                "resources/css/theme/components/micro/buttons.css",
                "resources/css/theme/components/micro/inputs.css",

                "resources/css/header.css",
                "resources/css/footer.css",
                "resources/css/404.css",
                "resources/css/components.css",
                "resources/css/signin.css",
                "resources/css/signup.css",
                "resources/css/home.css",
                "resources/css/about.css",
                "resources/css/contact.css",
                "resources/css/admin_panel.css",
                "resources/css/admin_login.css",

                "resources/js/app.js",
                "resources/js/main.js",
                "resources/js/pages/client/home.js",
                "resources/js/pages/client/contact.js",
                "resources/js/pages/client/signin.js",
                "resources/js/pages/client/signup.js",
                "resources/js/pages/admin/admin_panel.js",
                "resources/js/pages/admin/admin_login.js",
            ],
            refresh: true,
        }),
    ],
});
