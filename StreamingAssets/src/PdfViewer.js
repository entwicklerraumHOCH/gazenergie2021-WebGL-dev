﻿function PdfViewer (url) {
    const baseUrl = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.10.377/';

    if (!pdfjsLib.getDocument || !pdfjsViewer.PDFViewer) {
        // eslint-disable-next-line no-alert
        alert("Please build the pdfjs-dist library using\n  `gulp dist-install`");
    }

// The workerSrc property shall be specified.
//
    pdfjsLib.GlobalWorkerOptions.workerSrc =
        baseUrl + 'build/pdf.worker.js';

// Some PDFs need external cmaps.
//
    const CMAP_URL = baseUrl + 'cmaps/';
    const CMAP_PACKED = true;

    const DEFAULT_URL = url;
// To test the AcroForm and/or scripting functionality, try e.g. this file:
// "../../test/pdfs/160F-2019.pdf"

    const ENABLE_XFA = true;
    const SEARCH_FOR = ""; // try "Mozilla";

    const SANDBOX_BUNDLE_SRC = baseUrl + 'build/pdf.sandbox.js';

    const container = document.getElementById("pdf-viewer-container");

    const eventBus = new pdfjsViewer.EventBus();

// (Optionally) enable hyperlinks within PDF files.
    const pdfLinkService = new pdfjsViewer.PDFLinkService({
        eventBus,
    });

// (Optionally) enable find controller.
    const pdfFindController = new pdfjsViewer.PDFFindController({
        eventBus,
        linkService: pdfLinkService,
    });

// (Optionally) enable scripting support.
    const pdfScriptingManager = new pdfjsViewer.PDFScriptingManager({
        eventBus,
        sandboxBundleSrc: SANDBOX_BUNDLE_SRC,
    });

    const pdfViewer = new pdfjsViewer.PDFViewer({
        container,
        eventBus,
        linkService: pdfLinkService,
        findController: pdfFindController,
        scriptingManager: pdfScriptingManager,
        enableScripting: true, // Only necessary in PDF.js version 2.10.377 and below.
    });
    pdfLinkService.setViewer(pdfViewer);
    pdfScriptingManager.setViewer(pdfViewer);

    eventBus.on("pagesinit", function () {
        // We can use pdfViewer now, e.g. let's change default scale.
        pdfViewer.currentScaleValue = "page-width";

        // We can try searching for things.
        if (SEARCH_FOR) {
            if (!pdfFindController._onFind) {
                pdfFindController.executeCommand("find", {query: SEARCH_FOR});
            } else {
                eventBus.dispatch("find", {type: "", query: SEARCH_FOR});
            }
        }
    });

// Loading document.
    const loadingTask = pdfjsLib.getDocument({
        url: DEFAULT_URL,
        cMapUrl: CMAP_URL,
        cMapPacked: CMAP_PACKED,
        enableXfa: ENABLE_XFA,
    });
    (async function () {
        const pdfDocument = await loadingTask.promise;
        // Document loaded, specifying document for the viewer and
        // the (optional) linkService.
        pdfViewer.setDocument(pdfDocument);

        pdfLinkService.setDocument(pdfDocument, null);
    })();
}