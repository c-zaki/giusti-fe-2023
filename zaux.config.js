const assetsPath = "./src/assets";

//Tokens import
var colors = require("./src/data/tokens/colors.json");
var breakpoints = require("./src/data/tokens/breakpoints.json");
var containers = require("./src/data/tokens/containers.json");
var grid = require("./src/data/tokens/grid.json");
var iconSizes = require("./src/data/tokens/icon_sizes.json");
var radius = require("./src/data/tokens/radius.json");
var ratios = require("./src/data/tokens/ratios.json");
var shadows = require("./src/data/tokens/shadows.json");
var typo = require("./src/data/tokens/typo.json");
var spaces = require("./src/data/tokens/spaces.json");
var defs = require("./src/data/tokens/defs.json");
var blur = require("./src/data/tokens/blur.json");

/*-- FUNCTIONS --*/
function rgba(hex, alpha) {
  var r = parseInt(hex.substring(1, 3), 16);
  var g = parseInt(hex.substring(3, 5), 16);
  var b = parseInt(hex.substring(5, 7), 16);

  var rgba = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
  return rgba;
}
/*-- END OF FUNCTIONS --*/

//Icons setup
var iconList = require(`${assetsPath}/icon/${defs.activeIconSet}/selection.json`);
defs.activeIcons = {};

iconList.icons.forEach( (icon,index) => {
    defs.activeIcons[icon.properties.name] = icon.properties.name;
});

/*-- TOKENS AND STYLES --*/

const tokens = {
    "defs" : defs,
    "colors" : colors,
    "breakpoints" : breakpoints,
    "containers" : containers,
    "grid" : grid,
    "iconSizes" : iconSizes,
    "radius" : radius,
    "ratios" : ratios,
    "shadows" : shadows,
    "typo" : typo,
    "spaces" : spaces,
    "blur" : blur
};

const styles = {
    "overlay" : {
        "1" : { "background" : "linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0) 100%)"},
        "2" : { "background" : rgba(tokens.colors.set1.color3, 0.5) }
    },
    "typography" : {
        "style1" : [
            {
                "name" : "display-1",
                "fontFamily" : tokens.defs.mainFont,
                "fontSize" : tokens.typo.sizes[7],
                "fontWeight" : 600,
                "lineHeight" : tokens.typo.lineHeights[5],
                "responsive" : {
                    "md" : {
                        "fontSize" : tokens.typo.sizes[6],
                        "lineHeight" : tokens.typo.sizes[7]
                    }
                }
            },
            {
                "name" : "display-2",
                "fontFamily" : tokens.defs.mainFont,
                "fontSize" : tokens.typo.sizes[6],
                "fontWeight" : 600,
                "lineHeight" : tokens.typo.lineHeights[4]
            },
            {
                "name" : "display-3",
                "fontFamily" : tokens.defs.mainFont,
                "fontSize" : tokens.typo.sizes[5],
                "fontWeight" : 600,
                "lineHeight" : tokens.typo.lineHeights[3]
            },
            {
                "name" : "display-4",
                "fontFamily" : tokens.defs.mainFont,
                "fontSize" : tokens.typo.sizes[4],
                "fontWeight" : 600,
                "lineHeight" : tokens.typo.lineHeights[2]
            },
            {
                "name" : "title-l",
                "fontFamily" : tokens.defs.mainFont,
                "fontSize" : tokens.typo.sizes[5],
                "lineHeight" : tokens.typo.lineHeights[3],
                "fontWeight" : 400
            },
            {
                "name" : "text-l",
                "fontFamily" : tokens.defs.mainFont,
                "fontSize" : tokens.typo.sizes[4],
                "lineHeight" : tokens.typo.lineHeights[3]
            },
            {
                "name" : "text-m",
                "fontFamily" : tokens.defs.mainFont,
                "fontSize" : tokens.typo.sizes[2],
                "lineHeight" : tokens.typo.lineHeights[2]
            },
            {
                "name" : "text-s",
                "fontFamily" : tokens.defs.mainFont,
                "fontSize" : tokens.typo.sizes[1],
                "lineHeight" : tokens.typo.lineHeights[1]
            },
            {
                "name" : "eyelet-m",
                "fontFamily" : tokens.defs.mainFont,
                "fontSize" : tokens.typo.sizes[2],
                "lineHeight" : tokens.typo.lineHeights[1],
                "letterSpacing" : tokens.typo.letterSpacing[2],
                "textTransform": "uppercase",
                "fontWeight" : 700
            }
        ]
    }
};

module.exports = {
    "properties" : {
        "mediaDistURL" : "../media",
        "assetsDistURL" : "../assets",
    },
    "tokens" : tokens,
    "styles" : styles
};