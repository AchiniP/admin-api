import sinon  from 'sinon';
import { processTeacherData } from '../src/controllers/AdminController';
import DBConnecterRepository from '../src/repository/DBConnecterRepository';
const data = require('./utils/teacherDBData.json');

describe('processTeacherData', () => {
  let dbRepoStub;
  beforeEach(function () {
    dbRepoStub = sinon.stub(DBConnecterRepository, 'fetchTeacherDetails');
  });
  afterEach(function () {
    dbRepoStub.restore();
  });
  it('should populate teacher details object by different teachers', async () => {
    dbRepoStub.returns(Promise.resolve(data));
    const result = await processTeacherData();
    expect(Object.keys(result).length).toBe(4);
    expect(Object.keys(result).includes('Teacher 1')).toBe(true);
    expect(Object.keys(result).includes('Teacher 2')).toBe(true);
    expect(Object.keys(result).includes('Teacher 3')).toBe(true);
    expect(Object.keys(result).includes('Teacher 4')).toBe(true);
    expect(result['Teacher 1'].length).toBe(1);
    expect(result['Teacher 1'][0].numberOfClasses).toBe(1);
  });

  it('1 teacher can be able to teach in multiple classes', async () => {
    const updatedData = data;
    updatedData.push( {
      'teacheremail': 'teacher1@gmail.com',
      'teachername': 'Teacher 1',
      'mappingid': 1,
      'classcode': 'P1-2',
      'subjectname': 'maths',
      'subjectcode': 'MATHS'
    })
    dbRepoStub.returns(Promise.resolve(updatedData));
    const result = await processTeacherData();
    expect(Object.keys(result).length).toBe(4);
    expect(Object.keys(result).includes('Teacher 1')).toBe(true);
    expect(Object.keys(result).includes('Teacher 2')).toBe(true);
    expect(Object.keys(result).includes('Teacher 3')).toBe(true);
    expect(Object.keys(result).includes('Teacher 4')).toBe(true);
    expect(result['Teacher 1'].length).toBe(1);
    expect(result['Teacher 1'][0].numberOfClasses).toBe(2);
    updatedData.pop()
  });

  it('1 teacher can teach multiple subjects', async () => {
    const initialData = require('./utils/teacherDBData.json');
    console.log(initialData.length)
    initialData.push({
      'teacheremail': 'teacher1@gmail.com',
      'teachername': 'Teacher 1',
      'mappingid': 4,
      'classcode': 'P3-1',
      'subjectname': 'bio',
      'subjectcode': 'BIO'
    })
    console.log(initialData.length)
    dbRepoStub.returns(Promise.resolve(initialData));
    const result = await processTeacherData();
    console.log(result)
    expect(Object.keys(result).length).toBe(4);
    expect(Object.keys(result).includes('Teacher 1')).toBe(true);
    expect(Object.keys(result).includes('Teacher 2')).toBe(true);
    expect(Object.keys(result).includes('Teacher 3')).toBe(true);
    expect(Object.keys(result).includes('Teacher 4')).toBe(true);
    expect(result['Teacher 1'].length).toBe(2);
    expect(result['Teacher 1'][0].numberOfClasses).toBe(1);
    initialData.pop();
  }); 

})