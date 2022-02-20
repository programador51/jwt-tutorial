CREATE TABLE [Users]
(
  [id] INT PRIMARY KEY IDENTITY(1, 1),
  [isPremium] TINYINT NOT NULL,
  [password] NVARCHAR(MAX) NOT NULL,
  [email] NVARCHAR(256) NOT NULL
)
GO

CREATE TABLE [RefreshTokens]
(
  [id] INT PRIMARY KEY IDENTITY(1, 1),
  [browser] NVARCHAR(256),
  [country] NVARCHAR(256),
  [device] NVARCHAR(256),
  [deviceVersion] NVARCHAR(256),
  [ip] NVARCHAR(256),
  [refreshToken] NVARCHAR(256) NOT NULL,
  [userId] INT NOT NULL
)
GO

ALTER TABLE [RefreshTokens] ADD FOREIGN KEY ([userId]) REFERENCES [Users] ([id])
GO