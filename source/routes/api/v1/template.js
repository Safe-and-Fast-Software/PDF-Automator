import { ReasonPhrases, StatusCodes } from "http-status-codes";
import pdfMakePrinter from "pdfmake/src/printer.js";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export async function previewTemplate(request, responds) {
  const isNotAnHtmxRequest = (request.headers["hx-request"] === undefined);
  try {

      let requestQueryJSON = undefined;
      /* Trying to see if the JSON parameter is valid. */ {
          try { 
              
              if (request?.query.json) requestQueryJSON = JSON.parse(request.query.json);
              else if (request?.body.json) requestQueryJSON = JSON.parse(request.body.json);
              else requestQueryJSON = JSON.parse(request.body);

          } catch ( error ) { console.error(error);
              
              const errorResponds = { 
                  status: StatusCodes.BAD_REQUEST, 
                  error: `${ReasonPhrases.BAD_REQUEST}: the JSON is not valid.`,
              };

              /* Giving a JSON error responds if it's not an HTMX request */ {
                  if (isNotAnHtmxRequest) return ( responds
                      .status(errorResponds.status)
                      .type('application/json')
                      .send(errorResponds)
                  );
              }

              /* Giving an HTML error responds in all other cases. */ {
                  return ( responds
                      .status(errorResponds.status)
                      .type('text/html')
                      .send(errorResponds.error)
                  ); 
              }
          }
      }

      const documentDefinition = {
          content: requestQueryJSON,
      };

      const fonts = {
          Roboto: {
              normal:       '/app/public/fonts/roboto-regular.ttf',
              bold:         '/app/public/fonts/roboto-bold.ttf',
              italics:      '/app/public/fonts/roboto-italic.ttf',
              bolditalics:  '/app/public/fonts/roboto-bold-italic.ttf',
          },
      };

      const printer = new pdfMakePrinter(fonts);
      const document = printer.createPdfKitDocument(documentDefinition);
      const stream = responds.writeHead(StatusCodes.OK, {
          'Content-Type': 'application/pdf,',
          'Content-Disposition': `inline; filename="${request?.query.name}.pdf"`
      });

      /* Building the document, and sending it when it's done. */ {
          document.on('data', (chunk) => stream.write(chunk) );
          document.on('end',  (     ) => stream.end()        );
          document.end();
      }


  } catch ( error ) { console.error(error);
      
      const errorResponds = { 
          status: StatusCodes.INTERNAL_SERVER_ERROR, 
          error: `${ReasonPhrases.INTERNAL_SERVER_ERROR}: could not create preview.`,
      };

      /* Giving a JSON error responds if it's not an HTMX request */ {
          if (isNotAnHtmxRequest) return ( responds
              .status(errorResponds.status)
              .type('application/json')
              .send(errorResponds)
          );
      }

      /* Giving an HTML error responds in all other cases. */ {
          return ( responds
              .status(errorResponds.status)
              .type('text/html')
              .send(errorResponds.error)
          ); 
      }
  }
};
