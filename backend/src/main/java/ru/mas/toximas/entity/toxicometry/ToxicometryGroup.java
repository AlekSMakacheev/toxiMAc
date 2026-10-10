package ru.mas.toximas.entity.toxicometry;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "toxicometry_groups")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ToxicometryGroup {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "experiment_id", nullable = false)
  private ToxicometryExperiment experiment;

  @Column(nullable = false)
  private Double dose;

  @Column(nullable = false)
  private Integer total;

  @Column(nullable = false)
  private Integer effect;
}
