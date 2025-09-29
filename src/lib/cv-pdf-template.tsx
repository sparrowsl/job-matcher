import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import { format } from 'date-fns';

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2 solid #2563eb',
    paddingBottom: 15,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 5,
  },
  title: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  contactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    fontSize: 10,
    color: '#475569',
  },
  contactItem: {
    marginRight: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10,
    borderBottom: '1 solid #e2e8f0',
    paddingBottom: 5,
  },
  summary: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 1.6,
    textAlign: 'justify',
  },
  experienceItem: {
    marginBottom: 15,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  company: {
    fontSize: 11,
    color: '#2563eb',
    marginBottom: 3,
  },
  dateRange: {
    fontSize: 10,
    color: '#64748b',
  },
  description: {
    fontSize: 10,
    color: '#475569',
    lineHeight: 1.5,
    marginBottom: 5,
  },
  achievementsList: {
    marginLeft: 15,
  },
  achievement: {
    fontSize: 10,
    color: '#475569',
    lineHeight: 1.5,
    marginBottom: 3,
  },
  educationItem: {
    marginBottom: 12,
  },
  degree: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  institution: {
    fontSize: 10,
    color: '#2563eb',
    marginBottom: 2,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillBadge: {
    backgroundColor: '#eff6ff',
    color: '#1e40af',
    padding: '4 10',
    borderRadius: 4,
    fontSize: 9,
    marginBottom: 6,
  },
  projectItem: {
    marginBottom: 12,
  },
  projectName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 3,
  },
  projectDescription: {
    fontSize: 10,
    color: '#475569',
    lineHeight: 1.5,
    marginBottom: 4,
  },
  technologies: {
    fontSize: 9,
    color: '#64748b',
    fontStyle: 'italic',
  },
});

interface CVData {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  title?: string;
  summary?: string;
  skills?: string[];
  experience?: any[];
  education?: any[];
  projects?: any[];
  certifications?: any[];
}

export const CVPDFTemplate: React.FC<{ data: CVData }> = ({ data }) => {
  const formatDate = (date: any) => {
    if (!date) return '';
    try {
      return format(new Date(date), 'MMM yyyy');
    } catch {
      return '';
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.fullName}</Text>
          {data.title && <Text style={styles.title}>{data.title}</Text>}
          <View style={styles.contactInfo}>
            {data.email && (
              <Text style={styles.contactItem}>{data.email}</Text>
            )}
            {data.phone && (
              <Text style={styles.contactItem}>{data.phone}</Text>
            )}
            {data.location && (
              <Text style={styles.contactItem}>{data.location}</Text>
            )}
          </View>
        </View>

        {/* Professional Summary */}
        {data.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summary}>{data.summary}</Text>
          </View>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillsContainer}>
              {data.skills.map((skill, index) => (
                <Text key={index} style={styles.skillBadge}>
                  {skill}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            {data.experience.map((exp, index) => (
              <View key={index} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <View>
                    <Text style={styles.jobTitle}>{exp.position}</Text>
                    <Text style={styles.company}>
                      {exp.company}
                      {exp.location && ` - ${exp.location}`}
                    </Text>
                  </View>
                  <Text style={styles.dateRange}>
                    {formatDate(exp.startDate)} -{' '}
                    {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </Text>
                </View>
                {exp.description && (
                  <Text style={styles.description}>{exp.description}</Text>
                )}
                {exp.achievements && JSON.parse(exp.achievements).length > 0 && (
                  <View style={styles.achievementsList}>
                    {JSON.parse(exp.achievements).map(
                      (achievement: string, i: number) => (
                        <Text key={i} style={styles.achievement}>
                          • {achievement}
                        </Text>
                      )
                    )}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {data.education.map((edu, index) => (
              <View key={index} style={styles.educationItem}>
                <Text style={styles.degree}>
                  {edu.degree}
                  {edu.field && ` in ${edu.field}`}
                </Text>
                <Text style={styles.institution}>{edu.institution}</Text>
                <Text style={styles.dateRange}>
                  {formatDate(edu.startDate)} -{' '}
                  {edu.current ? 'Present' : formatDate(edu.endDate)}
                </Text>
                {edu.description && (
                  <Text style={styles.description}>{edu.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {data.projects.map((project, index) => (
              <View key={index} style={styles.projectItem}>
                <Text style={styles.projectName}>{project.name}</Text>
                {project.description && (
                  <Text style={styles.projectDescription}>
                    {project.description}
                  </Text>
                )}
                {project.technologies && (
                  <Text style={styles.technologies}>
                    Technologies: {JSON.parse(project.technologies).join(', ')}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {data.certifications.map((cert, index) => (
              <View key={index} style={styles.educationItem}>
                <Text style={styles.degree}>{cert.name}</Text>
                <Text style={styles.institution}>{cert.issuer}</Text>
                <Text style={styles.dateRange}>
                  Issued: {formatDate(cert.issueDate)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};
