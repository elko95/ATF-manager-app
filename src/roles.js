const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function() {
  ac.grant("atf")
    .readOwn("profile")
    .readAny("table")
    .readAny("domaine")
    .readAny("processus");

  ac.grant("admin")
    .extend("atf")
    .readAny("profile")
    .createAny("profile")
    .createAny("table")
    .createAny("domaine")
    .createAny("processus")
    .updateAny("profile")
    .updateAny("table")
    .updateAny("domaine")
    .updateAny("processus")
    .deleteAny("profile")
    .deleteAny("table")
    .deleteAny("domaine")
    .deleteAny("processus");

  return ac;
})();
