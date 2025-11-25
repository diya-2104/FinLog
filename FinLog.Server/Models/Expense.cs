using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FinLog.Server.Models
{
    [Table("Expense")]
    public class Expense
    {
        [Key]
        public int eid { get; set; }

        [Required]
        public DateTime edate { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal eamount { get; set; }

        [Required]
        public int cid { get; set; }  // category id

        [Required]
        public int uid { get; set; }  // user id

        // Optional: navigation properties
        public Category? Category { get; set; }
        public User? User { get; set; }
    }
}

