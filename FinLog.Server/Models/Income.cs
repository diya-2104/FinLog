using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace FinLog.Server.Models
{
    [Table("Income")]
    public class Income
    {
        [Key]
        public int iid { get; set; }

        [Required]
        public DateTime date { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal amount { get; set; }

        [Required]
        public int cid { get; set; }
        public Category? Category { get; set; }

        [Required]
        public int uid { get; set; }

        [ForeignKey("uid")]
        public User? User { get; set; }


        [Required]
        [Column("Budget", TypeName = "decimal(18,2)")]
        [JsonPropertyName("Budget")]
        public decimal Budget { get; set; }
    }
}
