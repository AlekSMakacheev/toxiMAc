package ru.mas.toximas.entity.toxicokinetic;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "toxicokinetic_experiments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ToxicokineticExperiment {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String name;

  @Column(nullable = false)
  private String substance;

  private Double dose;

  private String route;

  @Column(length = 1000)
  private String notes;

  @Column(nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @OneToMany(mappedBy = "experiment", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<ToxicokineticPoint> points = new ArrayList<>();

  @PrePersist
  protected void onCreate() {
    createdAt = LocalDateTime.now();
  }
}
