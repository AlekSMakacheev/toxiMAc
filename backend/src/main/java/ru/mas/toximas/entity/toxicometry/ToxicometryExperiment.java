package ru.mas.toximas.entity.toxicometry;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "toxicometry_experiments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ToxicometryExperiment {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String name;

  @Column(nullable = false)
  private String substance;

  private String species;

  @Column(length = 1000)
  private String notes;

  @Column(nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @OneToMany(mappedBy = "experiment", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<ToxicometryGroup> groups = new ArrayList<>();

  @PrePersist
  protected void onCreate() {
    createdAt = LocalDateTime.now();
  }
}