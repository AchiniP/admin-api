export const FETCH_ALL_TEACHER_DATA = `SELECT teacher.teacheremail, 
teacher.teachername, 
teacher_class_subject.mappingid, 
class_subject.classcode, 
subject.subjectname, 
subject.subjectcode 
FROM teacher 
INNER JOIN teacher_class_subject 
ON teacher.teacheremail = teacher_class_subject .teacheremail 
INNER JOIN class_subject 
ON teacher_class_subject.mappingid = class_subject.id 
INNER JOIN subject 
ON class_subject.subjectcode = subject.subjectcode;`;

