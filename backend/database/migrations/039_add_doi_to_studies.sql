-- ---------------------------------------------------------------------------
-- studies.doi — optional DOI that an outside registrar already issued for the
-- study. Stored for display and structured data only, as the bare identifier
-- (10.xxxx/yyyy). The platform does not register or mint DOIs.
-- ---------------------------------------------------------------------------
ALTER TABLE studies ADD COLUMN doi VARCHAR(200) NULL AFTER study_type;
