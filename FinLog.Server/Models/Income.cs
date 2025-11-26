using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FinLog.Server.Models
{
    [Table("Income")]
    public class Income
    {
        [Key] public int iid { get; set; }
        [Required] public DateTime date { get; set; }
        [Required, Column(TypeName = "decimal(18,2)")] public decimal amount { get; set; }
        [Required] public int account_id { get; set; }
        [ForeignKey("account_id")] public Account ?Account { get; set; }
        [Required] public int uid { get; set; }
        [ForeignKey("uid")] public User ?User { get; set; }
        public string? description { get; set; }
        [Column(TypeName = "decimal(18,2)")] public decimal budget { get; set; }
    }
}
