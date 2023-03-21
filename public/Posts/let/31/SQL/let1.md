데이터베이스 3주차 수업
*^*MET*^*

# 데이터베이스 3주차 수업
*필자는 PGSQL을 사용해서 PGSQL과 비교하는 문구가 많다*    
*알아두기: 필자는 회사에서 **SQL문중 예약어는 무조건 대문자로** 라고 배워서 그걸 준수한다.*
## 학습목표
- 데이터베이스 모델링
- 데이터베이스 구축
- 데이터베이스 개체활용
- 테이블,뷰,인덱스,스토어드 프로시저,트리거

## 정보시스템 구축단계
- 분석
> 제일 중요하다.    
> 무엇을 하고자 하는지 결정
- 설계
> 제일 오래걸리고 제일 잘해야함.    
> how를 결정
- 구현
- 시험
- 유지/보수

## DB모델링과 용어
- 모델링 
> 현실세계에서 사용되는 데이터를 SQL에 어떻게 옮길지 결정하는 과정
- Primary Key
> Pk, 유일해야 한다.    
> 열만 지정가능하다.
- Table
> TB, 데이터가 모인 집합
- DBMS
> RDBMS에서 R만 뺴시오  
> 데이터베이스
- 열(필드,column)
> 세로
- 행 (row,record)
> 가로, 데이터
- SQL
> 쿼리. DB에서 데이터를 뽑기위한 질문임.

*^*ADV*^*
## SCHEMA 만들기
- MYSQL에서 만들면 된다. 
- 워크벤치 GUI가 편함.

### CREATE TABLE 시 GUI 상 약어.
- PK - Primary Key
- NN - None-Null
- UQ -  
- B - 
- UN - 
- ZF - 
- AI - 
- G -  

### SQL 언어화 (CREATE TABLE시)
LIKE 
```SQL
CREATE TABLE `tb_name` {
    cul_name type NOT NULL ... 
    -- PGSQL과 다르게, MYSQL은 NULL에도 NULL을 명시한다.
}
PRIMARY KEY ('cul_name');
-- MYSQL 은 CREATE TABLE 시 ``을 써야한다. 

CREATE TABLE `tb_name` (id INT)
```
## SQL 구문
- 사실 표준 SQL구문이 있어서 MYSQL에 적용되는걸 보자.

### SELECT
```SQL
SELECT * FROM tb_name; 
SELECT culname1,culname2 FROM tb_name WHERE culname2 = 'name';

-- PGSQL 과 같다.
```

### INSERT
```SQL
INSERT INTO 'db_name','tb_name'('cul_name')VALUES('val');
--PGSQL과 다른점은 db_name 표기가 있다는 점
```

### DROP
```SQL
DROP DATABASE `db_name`
DROP TABLE `tb_name`
```

### INDEX
- 색인.
- index를 걸어야 빠르게 데이터를 찾아준다. 한 10만개 찾아보면 안다.
- 동작원리는 B-Tree같은게 있다.
- 만들어야한다. (지정안해주면 안만들어줌)

```SQL
CREATE TABLE indexTBL(first_name VARCHAR(14),last_name VARCHAR(14),hire_date DATE); -- index table
INSERT INTO indexTBL -- 
            SELECT first_name,last_name,hire_date -- 지정할 행
            FROM employees,employees 
            ORDER BY first_name -- 그냥 붙힘
            LIMIT 500; 
SELECT * FROM indexTBL;
-- PGSQL의 index기능과는 다른점이 보인다.
```

## 스튜어드 
- PGSQL function 처럼 사용가능한 기능.

## 트리거
```SQL
DELIMITER //
CREATE TRIGGER trg_deletedMemberTBL 
AFTER DELETE -- DELETE 후
ON tb_deletedMember
FOR EACH ROW 
BEGIN
    --내용
END
DELIMITER;
-- PGSQL과는 좀 다르다. function이 아니라 DELIMITER로 씀.
```


