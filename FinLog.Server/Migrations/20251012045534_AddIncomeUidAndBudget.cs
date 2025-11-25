using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace FinLog.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddIncomeUidAndBudget : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Category_User_Useruid",
                table: "Category");

            migrationBuilder.DropIndex(
                name: "IX_Category_Useruid",
                table: "Category");

            migrationBuilder.DropColumn(
                name: "Useruid",
                table: "Category");

            migrationBuilder.AddColumn<string>(
                name: "color",
                table: "Category",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "Income",
                columns: table => new
                {
                    iid = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    amount = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    cid = table.Column<int>(type: "integer", nullable: false),
                    uid = table.Column<int>(type: "integer", nullable: false),
                    Budget = table.Column<decimal>(type: "numeric(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Income", x => x.iid);
                    table.ForeignKey(
                        name: "FK_Income_Category_cid",
                        column: x => x.cid,
                        principalTable: "Category",
                        principalColumn: "cid",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Income_User_uid",
                        column: x => x.uid,
                        principalTable: "User",
                        principalColumn: "uid",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Category_uid",
                table: "Category",
                column: "uid");

            migrationBuilder.CreateIndex(
                name: "IX_Income_cid",
                table: "Income",
                column: "cid");

            migrationBuilder.CreateIndex(
                name: "IX_Income_uid",
                table: "Income",
                column: "uid");

            migrationBuilder.AddForeignKey(
                name: "FK_Category_User_uid",
                table: "Category",
                column: "uid",
                principalTable: "User",
                principalColumn: "uid",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Category_User_uid",
                table: "Category");

            migrationBuilder.DropTable(
                name: "Income");

            migrationBuilder.DropIndex(
                name: "IX_Category_uid",
                table: "Category");

            migrationBuilder.DropColumn(
                name: "color",
                table: "Category");

            migrationBuilder.AddColumn<int>(
                name: "Useruid",
                table: "Category",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Category_Useruid",
                table: "Category",
                column: "Useruid");

            migrationBuilder.AddForeignKey(
                name: "FK_Category_User_Useruid",
                table: "Category",
                column: "Useruid",
                principalTable: "User",
                principalColumn: "uid");
        }
    }
}
