using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace FinLog.Server.Migrations
{
    /// <inheritdoc />
    public partial class createcategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Users",
                table: "Users");

            migrationBuilder.RenameTable(
                name: "Users",
                newName: "User");

            migrationBuilder.AddPrimaryKey(
                name: "PK_User",
                table: "User",
                column: "uid");

            migrationBuilder.CreateTable(
                name: "Category",
                columns: table => new
                {
                    cid = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    cname = table.Column<string>(type: "text", nullable: false),
                    uid = table.Column<int>(type: "integer", nullable: false),
                    Useruid = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Category", x => x.cid);
                    table.ForeignKey(
                        name: "FK_Category_User_Useruid",
                        column: x => x.Useruid,
                        principalTable: "User",
                        principalColumn: "uid");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Category_Useruid",
                table: "Category",
                column: "Useruid");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Category");

            migrationBuilder.DropPrimaryKey(
                name: "PK_User",
                table: "User");

            migrationBuilder.RenameTable(
                name: "User",
                newName: "Users");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Users",
                table: "Users",
                column: "uid");
        }
    }
}
