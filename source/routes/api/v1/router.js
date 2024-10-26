"use-strict";

import requiresAuthentication from "#source/utilities/auth/require-authentication.js";
import ensureValidType from "#source/routes/api/v1/ensure-valid-type.js"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { Router } from "express";
export const router = Router();

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ End Points ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

//|----------------------------------------------------- By ID -----------------------------------------------------|//

//`------------------------------------------------------ PUT ------------------------------------------------------`//

router.put("/:type/by-id/:id", requiresAuthentication, ensureValidType, createResource);

//`------------------------------------------------------ GET ------------------------------------------------------`//

import { getByID } from '#source/routes/api/v1/by-id.js';
router.get("/:type/by-id/:id", requiresAuthentication, ensureValidType, getByID);

//`------------------------------------------------------ POST -----------------------------------------------------`//

import { postByID } from '#source/routes/api/v1/by-id.js';
router.post("/:type/by-id/:id", requiresAuthentication, ensureValidType, postByID);

//`----------------------------------------------------- DELETE ----------------------------------------------------`//

import { deleteByID } from '#source/routes/api/v1/by-id.js';
router.delete("/:type/by-id/:id", requiresAuthentication, ensureValidType, deleteByID);

//|------------------------------------------------- Miscellaneous -------------------------------------------------|//

//`------------------------------------------------------ GET ------------------------------------------------------`//

import { specifications } from "#source/routes/api/v1/specifications.js";
router.get("/", specifications);

import { search } from "#source/routes/api/v1/search.js"
router.get("/:type/all", requiresAuthentication, ensureValidType, search);
router.get("/:type/search", requiresAuthentication, ensureValidType, search);

import { previewTemplate } from '#source/routes/api/v1/template.js';
router.get("/template/preview/", requiresAuthentication, previewTemplate);

//`------------------------------------------------------ PUT ------------------------------------------------------`//

import { createResource } from '#source/routes/api/v1/create-resource.js';
router.put("/:type/", requiresAuthentication, ensureValidType, createResource);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
