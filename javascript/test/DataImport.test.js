import _ from 'lodash';
import sinon from 'sinon';
import DBConnecterRepository from '../src/repository/DBConnecterRepository';
import { parseData, generateReferenceData } from '../src/controllers/DataImportController';
const data = require('./utils/testData.json');
const jsonStr = JSON.stringify(data);


describe('parseData', () => {
  const result = parseData(data);
  it('should generate teacher arrays correctly', () => {
    const expectedTeacherData = [
      { teacherEmail: 'teacher1@gmail.com', teacherName: 'Teacher 1' },
      { teacherEmail: 'teacher1@gmail.com', teacherName: 'Teacher A' },
      { teacherEmail: 'teacher2@gmail.com', teacherName: 'Teacher 2' },
      { teacherEmail: 'teacher1@gmail.com', teacherName: 'Teacher c2' },
      { teacherEmail: 'teacher3@gmail.com', teacherName: 'Teacher c3' },
    ];
    const { teacherDataMap } = result;
    const duplicateRemovedData = _.uniqWith(teacherDataMap, _.isEqual);
    expect(duplicateRemovedData.length).toBe(expectedTeacherData.length)
    expect(duplicateRemovedData.sort()).toEqual(expectedTeacherData.sort());
  });
  it('should generate student arrays correctly', () => {
    const expectedStudentData = [
      { studentEmail: 'commonstudent1@gmail.com', studentName: 'Common Student 1' },
      { studentEmail: 'commonstudent2@gmail.com', studentName: 'Common Student 2' },
      { studentEmail: 'commonstudent3@gmail.com', studentName: 'Common Student 3' },
      { studentEmail: 'commonstudent4@gmail.com', studentName: 'Common Student 1' },
      { studentEmail: 'commonstudent4@gmail.com', studentName: 'Common Student A' },
    ]
    const { studentDataMap } = result;
    const duplicateRemovedData = _.uniqWith(studentDataMap, _.isEqual);
    expect(duplicateRemovedData.length).toBe(expectedStudentData.length)
    expect(duplicateRemovedData.sort()).toEqual(expectedStudentData.sort());
  });
  it('should generate class subject arrays correctly', () => {
    const expectedCalssSubData = [
      { classCode: 'P1-1', subjectCode: 'MATHS' },
      { classCode: 'P2-1', subjectCode: 'PHYSICS' },
      { classCode: 'P2-1', subjectCode: 'MATHS' },
      { classCode: 'P2-1', subjectCode: 'BIO' }
    ];
    const { classSubjectDataMap } = result;
    const duplicateRemovedData = _.uniqWith(classSubjectDataMap, _.isEqual);
    expect(duplicateRemovedData.length).toBe(expectedCalssSubData.length)
    expect(duplicateRemovedData.sort()).toEqual(expectedCalssSubData.sort());
  });
});


describe('generateReferenceData', () => {
  const classSubjectDataMap = [
    { classCode: 'P1-1', subjectCode: 'MATHS' },
    { classCode: 'P2-1', subjectCode: 'PHYSICS' },
    { classCode: 'P2-1', subjectCode: 'MATHS' },
    { classCode: 'P2-1', subjectCode: 'BIO' }
  ];
  const mockData = [
    { id: 1, classCode: 'P1-1', subjectCode: 'MATHS' },
    { id: 2, classCode: 'P2-1', subjectCode: 'PHYSICS' },
    { id: 3, classCode: 'P2-1', subjectCode: 'MATHS' },
    { id: 4, classCode: 'P2-1', subjectCode: 'BIO' }
  ]
  let bulkCreateStub;
  let findAllStub;
  beforeEach(function () {
    bulkCreateStub = sinon.stub(DBConnecterRepository, 'bulkInsertData');
    findAllStub = sinon.stub(DBConnecterRepository, 'findAll');
  });
  afterEach(function () {
    bulkCreateStub.restore();
    findAllStub.restore();
  });
  it('should create correct refrence between teacher and subject data mapping', async () => {
    bulkCreateStub.returns(Promise.resolve(true));
    findAllStub.returns(Promise.resolve(mockData));
    const refData = await generateReferenceData(JSON.parse(jsonStr), classSubjectDataMap);
    const expectedData = [
      { teacherEmail: 'teacher1@gmail.com', mappingId: 1 },
      { teacherEmail: 'teacher2@gmail.com', mappingId: 2 },
      { teacherEmail: 'teacher1@gmail.com', mappingId: 3 },
      { teacherEmail: 'teacher3@gmail.com', mappingId: 3 },
      { teacherEmail: 'teacher3@gmail.com', mappingId: 4 }
    ]

    const { teacherClassSubjectMap } = refData;
    const duplicateRemovedData = _.uniqWith(teacherClassSubjectMap, _.isEqual);
    expect(duplicateRemovedData.sort()).toEqual(expectedData.sort());
  });

  it('should mark mapping record as deleted if isDelete = 1', async () => {
    bulkCreateStub.returns(Promise.resolve(true));
    findAllStub.returns(Promise.resolve(mockData));
    const refData = await generateReferenceData(JSON.parse(jsonStr), classSubjectDataMap);
    const expectedData = [{ teacherEmail: 'teacher1@gmail.com', mappingId: 1 }];
    const { deleteTeacherClassSubjectMap } = refData;
    expect(deleteTeacherClassSubjectMap.sort()).toEqual(expectedData.sort());
  });

  it('should create correct refrence between student and subject data mapping', async () => {
    bulkCreateStub.returns(Promise.resolve(true));
    findAllStub.returns(Promise.resolve(mockData));
    const refData = await generateReferenceData(JSON.parse(jsonStr), classSubjectDataMap);
    const expectedData = [
      { studentEmail: 'commonstudent1@gmail.com', mappingId: 1 },
      { studentEmail: 'commonstudent2@gmail.com', mappingId: 1 },
      { studentEmail: 'commonstudent3@gmail.com', mappingId: 1 },
      { studentEmail: 'commonstudent4@gmail.com', mappingId: 2 },
      { studentEmail: 'commonstudent4@gmail.com', mappingId: 3 },
      { studentEmail: 'commonstudent4@gmail.com', mappingId: 4 }
    ];

    const { studentClassSubjectMap } = refData;
    const duplicateRemovedData = _.uniqWith(studentClassSubjectMap, _.isEqual);

    expect(duplicateRemovedData.sort()).toEqual(expectedData.sort());

  });
});

// @TODO need to run mock sequelize 
describe('dataImportHandler', () => {
  it('should create a new teacher record if teacher not exists', () => {
  });

  it('should update teacher name with latest name', () => {
  });

  it('should create a new student record if student not exists', () => {
  });

  it('should update student name with latest name', () => {
  });

  it('should create a new subject record if subject not exists', () => {
  });

  it('should update subject name with latest name', () => {
  });

  it('should create a new class record if class not exists', () => {
  });

  it('should update class name with latest name', () => {
  });

  it('should create a new class_subject record if class and subject not exists', () => {
  });

  it('should not duplicate an entry in class_subject if already exists', () => {
  });

  it('should add record from teacher_class_subject if record not found and delete = 0', () => {
  });

  it('should remove record from teacher_class_subject if delete = 1', () => {
  });

});