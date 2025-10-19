/**
 * Copyright (c) Statsify
 *
 * This source code is licensed under the GNU GPL v3 license found in the
 * LICENSE file in the root directory of this source tree.
 * https://github.com/Statsify/statsify/blob/main/LICENSE
 */

import { Container } from "typedi";
import { FontRenderer, type Theme } from "@statsify/rendering";

const theme: Theme = {
  context: {
    renderer: Container.get(FontRenderer),
    boxColorId: "orange",
    boxColorFill: "rgb(44 13 1 / 0.60)",
  },
  elements: {},
};

export const getTheme = (): Theme => theme;