using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FinLog.Server.Models
{
    [Table("Transactions")]
    public class Transactions
    {
        [Key]
        public int tid { get; set; }

        [Required]
        public int uid { get; set; }

        [ForeignKey("uid")]
        public User? User { get; set; }

        [Required]
        public int cid { get; set; }

        [ForeignKey("cid")]
        public Category? Category { get; set; }

        [Required]
        public string ttype { get; set; } = string.Empty;  // income / expense

        [MaxLength(300)]
        public string? description { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal tamount { get; set; }

        [Required]
        public DateTime created_at { get; set; } = DateTime.Now;
    }
}
