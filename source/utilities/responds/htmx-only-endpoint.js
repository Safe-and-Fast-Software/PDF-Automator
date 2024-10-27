import { StatusCodes, ReasonPhrases } from "http-status-codes"; 

export default function htmxOnlyEndpoint(request, responds, next) {

  const isNotHtmxRequest = (request.headers["hx-request"] === undefined);
  if (isNotHtmxRequest) return ( responds
    .status(StatusCodes.BAD_REQUEST)
    .send(`${ReasonPhrases.BAD_REQUEST}: HTMX only endpoint`)
  );

  return next();
}