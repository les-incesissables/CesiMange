CREATE TABLE CesiMange.dbo.T_USER (
	id_user int IDENTITY(1,1) NOT NULL,
	email nvarchar(50) NOT NULL
);

select * from T_USER	