const config = require("../../../config")
module.exports = {
    async color(colorArg) {
        const colorMap = {
            "rouge": "#FF0000",
            "vert": "#00FF00",
            "bleu": "#0000FF",
            "noir": "#000000",
            "blanc": "#FFFFFF",
            "rose": "#dc14eb",
            "violet": "#764686",
            "sown": "#e1adff",
            "inside": "#99fcff",
            "orange": "#FFA500",
            "jaune": "#FFFF00",
            "marron": "#A52A2A",
            "gris": "#808080",
            "argent": "#C0C0C0",
            "cyan": "#00FFFF",
            "lavande": "#E6E6FA",
            "corail": "#FF7F50",
            "beige": "#F5F5DC",
            "defaut": config.client.color
        };

        const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        const lowerCaseColorArg = colorArg.toLowerCase();
        if (lowerCaseColorArg in colorMap) {
            const color = colorMap[lowerCaseColorArg];
            return color;
        } else if (colorRegex.test(colorArg)) {
            return colorArg;
        } else {
            return false;
        }
    }


};