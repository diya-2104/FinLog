using System.ComponentModel.DataAnnotations;

namespace FinLog.Server.Models
{
    public class TransactionDto
    {
        public int tid { get; set; }
        public int uid { get; set; }
        public int cid { get; set; }
        public string? cname { get; set; }   // Category name for frontend display
        public string ttype { get; set; } = string.Empty;
        public string? description { get; set; }
        public decimal tamount { get; set; }
        public DateTime created_at { get; set; }
    }
}
