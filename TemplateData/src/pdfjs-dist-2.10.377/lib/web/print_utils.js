/**
 * @licstart The following is the entire license notice for the
 * Javascript code in this page
 *
 * Copyright 2021 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @licend The above is the entire license notice for the
 * Javascript code in this page
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getXfaHtmlForPrinting = getXfaHtmlForPrinting;

var _ui_utils = require("./ui_utils.js");

var _xfa_layer_builder = require("./xfa_layer_builder.js");

var _pdf = require("../pdf");

function getXfaHtmlForPrinting(printContainer, pdfDocument) {
  const xfaHtml = pdfDocument.allXfaHtml;
  const factory = new _xfa_layer_builder.DefaultXfaLayerFactory();
  const scale = Math.round(_ui_utils.CSS_UNITS * 100) / 100;

  for (const xfaPage of xfaHtml.children) {
    const page = document.createElement("div");
    page.className = "xfaPrintedPage";
    printContainer.appendChild(page);
    const builder = factory.createXfaLayerBuilder(page, null, pdfDocument.annotationStorage, xfaPage);
    const viewport = (0, _pdf.getXfaPageViewport)(xfaPage, {
      scale
    });
    builder.render(viewport, "print");
  }
}
