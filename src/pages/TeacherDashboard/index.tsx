/**
 * Teacher Dashboard - View and manage reports
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getReports, updateReport, type Report } from '@/lib/api';
import { getCurrentUser, logout } from '@/lib/auth';
import { generateRecommendations, getRecommendations, saveRecommendations, type AIRecommendation } from '@/lib/ai';
import { exportReportToPDF } from '@/lib/pdfExport';
import { getAllStudents, type StudentInfo } from '@/lib/students';
import { analyzeStudentReports, type ReportAnalysis } from '@/lib/analysis';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, Download, Users, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import './TeacherDashboard.css';

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
  reviewed: { label: 'Examiné', color: 'bg-blue-100 text-blue-800' },
  resolved: { label: 'Résolu', color: 'bg-green-100 text-green-800' },
};

const emotionColors: Record<string, string> = {
  green: '#22c55e',
  yellow: '#eab308',
  orange: '#f97316',
  red: '#ef4444',
  'dark-red': '#dc2626',
};

export function TeacherDashboard() {
  const currentUser = getCurrentUser();
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [teacherNotes, setTeacherNotes] = useState('');
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  const [view, setView] = useState<'reports' | 'students'>('reports');
  const [selectedStudent, setSelectedStudent] = useState<StudentInfo | null>(null);
  const [studentAnalysis, setStudentAnalysis] = useState<ReportAnalysis | null>(null);

  useEffect(() => {
    loadReports();
    // Refresh every 30 seconds
    const interval = setInterval(loadReports, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadReports = async () => {
    try {
      setIsLoading(true);
      const data = await getReports();
      setReports(data);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (reportId: string, newStatus: string) => {
    try {
      await updateReport(reportId, newStatus);
      await loadReports();
      if (selectedReport?.id === reportId) {
        const updated = reports.find((r) => r.id === reportId);
        if (updated) setSelectedReport(updated);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const handleSaveNotes = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!selectedReport) return;
    try {
      await updateReport(selectedReport.id, undefined, teacherNotes);
      await loadReports();
      const updated = reports.find((r) => r.id === selectedReport.id);
      if (updated) {
        setSelectedReport(updated);
        setTeacherNotes(updated.teacherNotes || '');
      }
      setNotesSaved(true);
      // Reset saved state after 3 seconds
      setTimeout(() => {
        setNotesSaved(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving notes:', error);
      // Could show error state here if needed
    }
  };

  const handleGenerateAIRecommendations = async () => {
    if (!selectedReport) return;
    
    setIsGeneratingAI(true);
    try {
      const recommendations = await generateRecommendations(selectedReport);
      setAiRecommendations(recommendations);
      setShowAIRecommendations(true);
      // Save to localStorage
      saveRecommendations(selectedReport.id, recommendations);
    } catch (error) {
      console.error('Error generating AI recommendations:', error);
      alert('Erreur lors de la génération des recommandations. Veuillez réessayer.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const filteredReports = filter === 'all' 
    ? reports 
    : reports.filter((r) => r.status === filter);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="teacher-dashboard">
        <div className="loading">Chargement des signalements...</div>
      </div>
    );
  }

  return (
    <div className="teacher-dashboard">
      <div className="dashboard-header">
        <div className="dashboard-header-top">
          <div>
            <h1 className="dashboard-title">Tableau de bord enseignant</h1>
            {currentUser && (
              <p className="teacher-name">Enseignant: {currentUser.name}</p>
            )}
          </div>
          <div className="header-actions">
            <Link to="/">
              <Button variant="outline" className="home-button">
                Accueil
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => {
                logout();
                window.location.href = '/';
              }}
              className="logout-button"
            >
              Déconnexion
            </Button>
          </div>
        </div>
        <div className="dashboard-subtitle-row">
          <p className="dashboard-subtitle">
            {reports.length} signalement(s) au total • {reports.filter((r) => r.status === 'pending').length} en attente
          </p>
          <div className="view-toggle">
            <Button
              variant={view === 'reports' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setView('reports');
                setSelectedStudent(null);
                setStudentAnalysis(null);
              }}
            >
              Signalements
            </Button>
            <Button
              variant={view === 'students' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setView('students');
                setSelectedReport(null);
              }}
            >
              <Users className="users-icon" />
              Élèves
            </Button>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {view === 'reports' ? (
          <>
        <div className="reports-list">
          <div className="filters">
            <button
              onClick={() => setFilter('all')}
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            >
              Tous ({reports.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            >
              En attente ({reports.filter((r) => r.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('reviewed')}
              className={`filter-btn ${filter === 'reviewed' ? 'active' : ''}`}
            >
              Examinés ({reports.filter((r) => r.status === 'reviewed').length})
            </button>
            <button
              onClick={() => setFilter('resolved')}
              className={`filter-btn ${filter === 'resolved' ? 'active' : ''}`}
            >
              Résolus ({reports.filter((r) => r.status === 'resolved').length})
            </button>
          </div>

          <div className="reports-grid">
            {filteredReports.length === 0 ? (
              <div className="empty-state">
                <p>Aucun signalement à afficher</p>
              </div>
            ) : (
              filteredReports.map((report) => (
                <div
                  key={report.id}
                  className={`report-card ${selectedReport?.id === report.id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedReport(report);
                    setTeacherNotes(report.teacherNotes || '');
                    setNotesSaved(false);
                    // Load existing AI recommendations if available
                    const existing = getRecommendations(report.id);
                    if (existing) {
                      setAiRecommendations(existing);
                      setShowAIRecommendations(true);
                    } else {
                      setAiRecommendations(null);
                      setShowAIRecommendations(false);
                    }
                  }}
                >
                  <div className="report-card-header">
                    <div className="student-info">
                      <span className="student-name">{report.studentName}</span>
                      <span className="report-date">{formatDate(report.timestamp)}</span>
                    </div>
                    <span className={`status-badge ${statusLabels[report.status].color}`}>
                      {statusLabels[report.status].label}
                    </span>
                  </div>
                  
                  <div className="report-preview">
                    <div className="preview-item">
                      <span className="preview-label">Symboles :</span>
                      <div className="symbols-preview">
                        {report.symbols.slice(0, 3).map((s) => (
                          <span key={s.id} className="symbol-tag">
                            {s.label}
                          </span>
                        ))}
                        {report.symbols.length > 3 && (
                          <span className="symbol-tag">+{report.symbols.length - 3}</span>
                        )}
                      </div>
                    </div>
                    <div className="preview-item">
                      <span className="preview-label">Lieu :</span>
                      <span>{report.location.icon} {report.location.name}</span>
                    </div>
                    <div className="preview-item">
                      <span className="preview-label">Émotion :</span>
                      <div
                        className="emotion-indicator"
                        style={{ backgroundColor: emotionColors[report.emotion.color] }}
                      >
                        Level {report.emotion.level}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {selectedReport && (
          <div className="report-detail">
            <div className="detail-header">
              <h2>Détails du signalement</h2>
              <div className="detail-header-actions">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (selectedReport) {
                      exportReportToPDF(selectedReport, aiRecommendations);
                    }
                  }}
                  className="export-pdf-btn"
                >
                  <Download className="download-icon" />
                  Exporter en PDF
                </Button>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="close-btn"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="detail-content">
              <div className="detail-section">
                <h3>Élève</h3>
                <p>{selectedReport.studentName} (ID: {selectedReport.studentId})</p>
                <p className="text-sm text-muted-foreground">
                  Signalé le {formatDate(selectedReport.timestamp)}
                </p>
              </div>

              <div className="detail-section">
                <h3>Type d'incident</h3>
                <div className="symbols-list">
                  {selectedReport.symbols.map((symbol) => (
                    <div key={symbol.id} className="symbol-item">
                      <span className="symbol-category">{symbol.category}</span>
                      <span className="symbol-name">{symbol.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedReport.bodyMap && selectedReport.bodyMap.length > 0 && (
                <div className="detail-section">
                  <h3>Harcèlement physique</h3>
                  <div className="body-parts-list">
                    {selectedReport.bodyMap.map((point, index) => (
                      <span key={index} className="body-part-tag">
                        {point.bodyPart}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="detail-section">
                <h3>Lieu</h3>
                <p>
                  {selectedReport.location.icon} {selectedReport.location.name}
                </p>
              </div>

              <div className="detail-section">
                <h3>Fréquence</h3>
                <p>
                  {selectedReport.frequency.value === 'once' && 'Une fois'}
                  {selectedReport.frequency.value === 'sometimes' && 'Parfois'}
                  {selectedReport.frequency.value === 'often' && 'Souvent'}
                  {selectedReport.frequency.value === 'always' && 'Toujours'}
                </p>
              </div>

              <div className="detail-section">
                <h3>État émotionnel</h3>
                <div className="emotion-display">
                  <div className="emotion-bar">
                    <div
                      style={{
                        width: `${(selectedReport.emotion.level / 5) * 100}%`,
                        backgroundColor: emotionColors[selectedReport.emotion.color],
                        height: '100%',
                        borderRadius: '4px',
                      }}
                    />
                  </div>
                  <span>Level {selectedReport.emotion.level}/5</span>
                </div>
              </div>

              <div className="detail-section">
                <h3>Niveau de sécurité</h3>
                <div className="safety-display">
                  <div className="safety-bar">
                    <div
                      style={{
                        width: `${(selectedReport.safety.level / 5) * 100}%`,
                        backgroundColor:
                          selectedReport.safety.level <= 2
                            ? '#22c55e'
                            : selectedReport.safety.level <= 3
                            ? '#eab308'
                            : '#ef4444',
                        height: '100%',
                        borderRadius: '4px',
                      }}
                    />
                  </div>
                  <span>Level {selectedReport.safety.level}/5</span>
                </div>
              </div>

              <div className="detail-section">
                <h3>Statut</h3>
                <div className="status-actions">
                  <Button
                    variant={selectedReport.status === 'pending' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusChange(selectedReport.id, 'pending')}
                  >
                    En attente
                  </Button>
                  <Button
                    variant={selectedReport.status === 'reviewed' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusChange(selectedReport.id, 'reviewed')}
                  >
                    Examiné
                  </Button>
                  <Button
                    variant={selectedReport.status === 'resolved' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusChange(selectedReport.id, 'resolved')}
                  >
                    Résolu
                  </Button>
                </div>
              </div>

              <div className="detail-section">
                <h3>Recommandations IA</h3>
                {!showAIRecommendations ? (
                  <div className="ai-generate-section">
                    <p className="ai-description">
                      Générer des recommandations exploitables basées sur l'IA pour ce signalement.
                    </p>
                    <Button
                      onClick={handleGenerateAIRecommendations}
                      disabled={isGeneratingAI}
                      className="generate-ai-btn"
                      size="sm"
                    >
                      {isGeneratingAI ? (
                        <>
                          <Loader2 className="spinner-icon" />
                          Génération...
                        </>
                      ) : (
                        <>
                          <Sparkles className="sparkles-icon" />
                          Générer des recommandations
                        </>
                      )}
                    </Button>
                  </div>
                ) : aiRecommendations ? (
                  <div className="ai-recommendations">
                    <div className="ai-header">
                      <div className="ai-urgency">
                        <span className={`urgency-badge urgency-${aiRecommendations.urgency}`}>
                          URGENCE {aiRecommendations.urgency.toUpperCase()}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowAIRecommendations(false);
                          setAiRecommendations(null);
                        }}
                        className="hide-ai-btn"
                      >
                        Masquer
                      </Button>
                    </div>

                    <div className="ai-summary">
                      <h4>Résumé</h4>
                      <p>{aiRecommendations.summary}</p>
                    </div>

                    <div className="ai-actions">
                      <div className="action-group">
                        <h4>Actions immédiates</h4>
                        <ul>
                          {aiRecommendations.immediateActions.map((action, index) => (
                            <li key={index}>{action}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="action-group">
                        <h4>Actions à court terme</h4>
                        <ul>
                          {aiRecommendations.shortTermActions.map((action, index) => (
                            <li key={index}>{action}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="action-group">
                        <h4>Actions à long terme</h4>
                        <ul>
                          {aiRecommendations.longTermActions.map((action, index) => (
                            <li key={index}>{action}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="ai-resources">
                      <h4>Ressources</h4>
                      <ul>
                        {aiRecommendations.resources.map((resource, index) => (
                          <li key={index}>{resource}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="ai-notes">
                      <h4>Notes d'analyse</h4>
                      <p>{aiRecommendations.notes}</p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateAIRecommendations}
                      disabled={isGeneratingAI}
                      className="regenerate-ai-btn"
                    >
                      {isGeneratingAI ? (
                        <>
                          <Loader2 className="spinner-icon" />
                          Régénération...
                        </>
                      ) : (
                        <>
                          <Sparkles className="sparkles-icon" />
                          Régénérer
                        </>
                      )}
                    </Button>
                  </div>
                ) : null}
              </div>

              <div className="detail-section">
                <h3>Notes de l'enseignant</h3>
                <textarea
                  value={teacherNotes}
                  onChange={(e) => {
                    setTeacherNotes(e.target.value);
                    setNotesSaved(false);
                  }}
                  placeholder="Ajoutez vos notes ici..."
                  className="notes-textarea"
                  rows={4}
                />
                <Button 
                  type="button"
                  onClick={handleSaveNotes} 
                  className={`mt-2 save-notes-btn ${notesSaved ? 'saved' : ''}`}
                  size="sm"
                  disabled={notesSaved}
                >
                  {notesSaved ? '✓ Enregistré' : 'Enregistrer les notes'}
                </Button>
              </div>
            </div>
          </div>
        )}
          </>
        ) : (
          <StudentsView
            reports={reports}
            selectedStudent={selectedStudent}
            studentAnalysis={studentAnalysis}
            onSelectStudent={(student) => {
              setSelectedStudent(student);
              const studentReports = reports.filter((r) => r.studentId === student.studentId);
              const analysis = analyzeStudentReports(studentReports);
              setStudentAnalysis(analysis);
            }}
            onBack={() => {
              setSelectedStudent(null);
              setStudentAnalysis(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

/**
 * Students View Component
 */
interface StudentsViewProps {
  reports: Report[];
  selectedStudent: StudentInfo | null;
  studentAnalysis: ReportAnalysis | null;
  onSelectStudent: (student: StudentInfo) => void;
  onBack: () => void;
}

function StudentsView({ reports, selectedStudent, studentAnalysis, onSelectStudent, onBack }: StudentsViewProps) {
  const students = getAllStudents();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedStudent) {
    const studentReports = reports.filter((r) => r.studentId === selectedStudent.studentId);
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    return (
      <div className="students-view">
        <div className="student-detail-container">
          <div className="student-detail-header">
            <Button variant="outline" size="sm" onClick={onBack} className="back-btn">
              ← Retour aux élèves
            </Button>
            <div className="student-header-info">
              <h2 className="student-detail-title">{selectedStudent.name}</h2>
              <p className="student-id">ID: {selectedStudent.studentId}</p>
            </div>
          </div>

          {studentAnalysis && (
            <div className="analysis-section">
              <h3 className="analysis-title">Analyse à long terme</h3>
              
              <div className={`trend-alert ${studentAnalysis.trendAnalysis.hasRecurringProblems ? 'critical' : studentAnalysis.trendAnalysis.isWorsening ? 'warning' : 'info'}`}>
                <div className="trend-icon">
                  {studentAnalysis.trendAnalysis.hasRecurringProblems ? (
                    <AlertTriangle />
                  ) : studentAnalysis.trendAnalysis.isWorsening ? (
                    <TrendingDown />
                  ) : (
                    <TrendingUp />
                  )}
                </div>
                <div className="trend-content">
                  <p className="trend-recommendation">{studentAnalysis.trendAnalysis.recommendation}</p>
                </div>
              </div>

              <div className="analysis-grid">
                <div className="analysis-card">
                  <h4>Aperçu</h4>
                  <div className="analysis-stats">
                    <div className="stat-item">
                      <span className="stat-label">Signalements totaux :</span>
                      <span className="stat-value">{studentAnalysis.totalReports}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Premier signalement :</span>
                      <span className="stat-value">{formatDate(studentAnalysis.firstReportDate)}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Dernier signalement :</span>
                      <span className="stat-value">{formatDate(studentAnalysis.lastReportDate)}</span>
                    </div>
                  </div>
                </div>

                <div className="analysis-card">
                  <h4>Niveaux moyens</h4>
                  <div className="analysis-stats">
                    <div className="stat-item">
                      <span className="stat-label">Émotion :</span>
                      <span className="stat-value">{studentAnalysis.averageEmotionLevel}/5</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Sécurité :</span>
                      <span className="stat-value">{studentAnalysis.averageSafetyLevel}/5</span>
                    </div>
                  </div>
                </div>

                <div className="analysis-card">
                  <h4>Catégories les plus fréquentes</h4>
                  <div className="category-list">
                    {studentAnalysis.mostCommonCategories.slice(0, 3).map((cat, index) => (
                      <div key={index} className="category-item">
                        <span className="category-name">{cat.category}</span>
                        <span className="category-count">{cat.count}x</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="analysis-card">
                  <h4>Modèle de fréquence</h4>
                  <div className="frequency-stats">
                    <div className="frequency-item">
                      <span>Une fois : {studentAnalysis.frequencyPattern.once}</span>
                    </div>
                    <div className="frequency-item">
                      <span>Parfois : {studentAnalysis.frequencyPattern.sometimes}</span>
                    </div>
                    <div className="frequency-item">
                      <span>Souvent : {studentAnalysis.frequencyPattern.often}</span>
                    </div>
                    <div className="frequency-item">
                      <span>Toujours : {studentAnalysis.frequencyPattern.always}</span>
                    </div>
                  </div>
                </div>
              </div>

              {studentAnalysis.recurringIssues.length > 0 && (
                <div className="recurring-issues">
                  <h4>⚠️ Problèmes récurrents détectés</h4>
                  <ul>
                    {studentAnalysis.recurringIssues.map((issue, index) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="student-reports-section">
            <h3 className="reports-section-title">Tous les signalements ({studentReports.length})</h3>
            <div className="student-reports-list">
              {studentReports.length === 0 ? (
                <div className="empty-state">
                  <p>Aucun signalement trouvé pour cet élève.</p>
                </div>
              ) : (
                studentReports
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .map((report) => (
                    <div key={report.id} className="student-report-card">
                      <div className="student-report-header">
                        <span className="report-date">{formatDate(report.timestamp)}</span>
                        <span className={`status-badge ${statusLabels[report.status].color}`}>
                          {statusLabels[report.status].label}
                        </span>
                      </div>
                      <div className="student-report-content">
                        <div className="report-info-row">
                          <span className="info-label">Catégories :</span>
                          <div className="report-categories">
                            {report.symbols.map((s) => (
                              <span key={s.id} className="category-badge-small">
                                {s.category}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="report-info-row">
                          <span className="info-label">Lieu :</span>
                          <span>{report.location.icon} {report.location.name}</span>
                        </div>
                        <div className="report-info-row">
                          <span className="info-label">Émotion :</span>
                          <span>Niveau {report.emotion.level}/5</span>
                        </div>
                        <div className="report-info-row">
                          <span className="info-label">Sécurité :</span>
                          <span>Niveau {report.safety.level}/5</span>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="students-list-view">
      <div className="students-header">
        <h2 className="students-title">Tous les élèves</h2>
        <div className="students-search">
          <input
            type="text"
            placeholder="Rechercher par nom ou ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="students-grid">
        {filteredStudents.length === 0 ? (
          <div className="empty-state">
            <p>Aucun élève trouvé.</p>
          </div>
        ) : (
          filteredStudents.map((student) => {
            const studentReports = reports.filter((r) => r.studentId === student.studentId);
            const pendingCount = studentReports.filter((r) => r.status === 'pending').length;
            const resolvedCount = studentReports.filter((r) => r.status === 'resolved').length;

            return (
              <div
                key={student.studentId}
                className="student-card"
                onClick={() => onSelectStudent(student)}
              >
                <div className="student-card-header">
                  <div className="student-info">
                    <span className="student-card-name">{student.name}</span>
                    <span className="student-card-id">ID: {student.studentId}</span>
                  </div>
                </div>
                <div className="student-card-preview">
                  <div className="preview-item">
                    <span className="preview-label">Signalements :</span>
                    <span className="preview-value">{studentReports.length}</span>
                  </div>
                  {pendingCount > 0 && (
                    <div className="preview-item">
                      <span className="preview-label">En attente :</span>
                      <span className={`status-badge ${statusLabels.pending.color}`}>
                        {pendingCount}
                      </span>
                    </div>
                  )}
                  {resolvedCount > 0 && (
                    <div className="preview-item">
                      <span className="preview-label">Résolus :</span>
                      <span className={`status-badge ${statusLabels.resolved.color}`}>
                        {resolvedCount}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

