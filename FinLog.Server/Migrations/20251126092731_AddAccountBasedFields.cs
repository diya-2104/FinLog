using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace FinLog.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddAccountBasedFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Add account_id to Expense table if it doesn't exist
            migrationBuilder.Sql(@"
                DO $$ 
                BEGIN 
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Expense' AND column_name='account_id') THEN
                        ALTER TABLE ""Expense"" ADD COLUMN account_id integer NOT NULL DEFAULT 1;
                    END IF;
                END $$;
            ");

            // Add description to Expense table if it doesn't exist
            migrationBuilder.Sql(@"
                DO $$ 
                BEGIN 
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Expense' AND column_name='description') THEN
                        ALTER TABLE ""Expense"" ADD COLUMN description text;
                    END IF;
                END $$;
            ");

            // Remove Budget column from Income table if it exists and add description
            migrationBuilder.Sql(@"
                DO $$ 
                BEGIN 
                    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Income' AND column_name='Budget') THEN
                        ALTER TABLE ""Income"" DROP COLUMN ""Budget"";
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Income' AND column_name='description') THEN
                        ALTER TABLE ""Income"" ADD COLUMN description text;
                    END IF;
                END $$;
            ");

            // Add account_id to Transactions table if it doesn't exist
            migrationBuilder.Sql(@"
                DO $$ 
                BEGIN 
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Transactions' AND column_name='account_id') THEN
                        ALTER TABLE ""Transactions"" ADD COLUMN account_id integer NOT NULL DEFAULT 1;
                    END IF;
                END $$;
            ");

            // Create foreign key constraints if they don't exist
            migrationBuilder.Sql(@"
                DO $$ 
                BEGIN 
                    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name='FK_Expense_Account_account_id') THEN
                        ALTER TABLE ""Expense"" ADD CONSTRAINT ""FK_Expense_Account_account_id"" FOREIGN KEY (account_id) REFERENCES ""Account"" (account_id) ON DELETE CASCADE;
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name='FK_Transactions_Account_account_id') THEN
                        ALTER TABLE ""Transactions"" ADD CONSTRAINT ""FK_Transactions_Account_account_id"" FOREIGN KEY (account_id) REFERENCES ""Account"" (account_id) ON DELETE CASCADE;
                    END IF;
                END $$;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Drop foreign key constraints
            migrationBuilder.Sql(@"
                ALTER TABLE ""Expense"" DROP CONSTRAINT IF EXISTS ""FK_Expense_Account_account_id"";
                ALTER TABLE ""Transactions"" DROP CONSTRAINT IF EXISTS ""FK_Transactions_Account_account_id"";
            ");

            // Remove columns
            migrationBuilder.Sql(@"
                ALTER TABLE ""Expense"" DROP COLUMN IF EXISTS account_id;
                ALTER TABLE ""Expense"" DROP COLUMN IF EXISTS description;
                ALTER TABLE ""Income"" DROP COLUMN IF EXISTS description;
                ALTER TABLE ""Transactions"" DROP COLUMN IF EXISTS account_id;
            ");

            // Add back Budget column to Income
            migrationBuilder.Sql(@"
                ALTER TABLE ""Income"" ADD COLUMN ""Budget"" numeric(18,2) NOT NULL DEFAULT 0;
            ");
        }
    }
}
