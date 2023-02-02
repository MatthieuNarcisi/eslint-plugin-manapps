/**
 * @fileoverview Rules for custom angular projects
 * @author Matthieu Narcisi
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const requireIndex = require("requireindex");

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

const obj = requireIndex(__dirname + "/rules");
const rules = {};
Object.keys(obj).forEach(
  (ruleName) => (rules[ruleName] = obj[ruleName].default)
);

// import all rules in lib/rules
module.exports = { rules };
