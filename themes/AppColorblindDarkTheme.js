import { DarkTheme as NavigationDarkTheme } from "@react-navigation/native"
import { DarkTheme as PaperDarkTheme } from "react-native-paper"

export const AppColorblindDarkTheme = {
  ...NavigationDarkTheme,
  ...PaperDarkTheme,
  roundness: 4,
  colors: {
    ...NavigationDarkTheme.colors,
    ...PaperDarkTheme.colors,
    primary: '#dc267f',
    accent: '#648fff',
    tertiary: "#ffb000",
    background: "#181818",
    surface: "#212121",
    black: "#000000",
    white: "#ffffff",
    greyscale: "#5a5a5a",
    greyScaleDark: "#313131",
    colorblockBlue: "#648fff",
    colorblockBlueDark: "#1d62cb",
    colorblockBlueLight: "#9cbfff",
    colorblockRed: "#dc267f",
    colorblockRedDark: "#a50053", 
    colorblockRedLight: "#ff63ae",
    colorblockYellow: "#ffb000",
    colorblockYellowDark: "#ffe24b",
    colorblockYellowLight: "#c68100",
    diztroBlue: "#0080ff",
    diztroBlueDark: "#0055cb",
    diztroBlueLight: "#69afff",
    diztroGreen: "#009e73",
    diztroGreenDark: "#006e47",
    diztroGreenLight: "#52d0a2",
    diztroOrange: "#fe6100",
    diztroOrangeDark: "#c32d00",
    diztroOrangeLight: "#ff933e",
    diztroPink: "#dc267f",
    diztroPinkDark: "#a50053", 
    diztroPinkLight: "#ff63ae",
    diztroPurple: "#785ef0",
    diztroPurpleDark: "#3f32bc",
    diztroPurpleLight: "#ae8cff",
    diztroYellow: "#ffb000",
    diztroYellowDark: "#ffe24b",
    diztroYellowLight: "#c68100",
    stripeActiveOutline: "#c4d6e9",
    stripeOutline: "#e6e6e6",
  },
};