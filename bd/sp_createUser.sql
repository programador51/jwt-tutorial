SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_createUser](
    @password NVARCHAR(MAX),
    @email NVARCHAR(256)
)

AS
BEGIN
    INSERT INTO Users
        (isPremium,password,email)
    VALUES
        (0, @password, @email)
END
GO
