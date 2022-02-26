SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_validateCanInsertUser]
    (@email NVARCHAR(256))
AS
BEGIN
    DECLARE @emailsFounded INT;

    SELECT @emailsFounded = COUNT(*)
    FROM Users
    WHERE email = @email;

    SELECT CASE
               WHEN @emailsFounded >= 1 THEN
                   CONVERT(BIT, 0)
               ELSE
                   CONVERT(BIT, 1)
           END AS canInsertEmail;
END

GO
