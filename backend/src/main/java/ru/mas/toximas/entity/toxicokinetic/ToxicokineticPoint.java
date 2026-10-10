package ru.mas.toximas.entity.toxicokinetic;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "toxicokinetic_points")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ToxicokineticPoint {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "experiment_id", nullable = false)
  private ToxicokineticExperiment experiment;

  @Column(nullable = false)
  private Double time;

  @Column(nullable = false)
  private Double concentration;
}
