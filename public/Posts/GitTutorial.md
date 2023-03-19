GIT의 개념과 사용방법
*^*MET*^*
> 배포대상 : Lathion Project Dev team
# GIT의 개념
## GIT이란?
- GIT이란, 프로그램의 형상을 관리하는 프로그램이다.
- 형상이라 함은, 프로그램의 코드 그 자체를 의미하며, 코드의 형태를 일정한 형태로 윶비하는 것을 의미한다.

## GIT의 관련개념
<a href="https://velog.io/@gillog/Git-Git-%EA%B0%9C%EB%85%90-%EC%A0%95%EB%A6%AC">참고</a>

### 주요한 개념 
- branch
  > 가지라는 의미를 가진다. 
  > branch는 하나의 분기로서, 각자의 독립적인 공간이라고 생각할 수 있다.    
  > 
- commit
  > 프로젝트가 변경된 이력.     
  > 즉, 원격저장소에 코드가 언제 어떻게 변경되었는지(git)를 저장하는 자료이다.
  > 커밋을 시도할 때에는, 커밋 메세지를 작성하여야 한다. 이때, 보통 아래의 양식을 따른다.     
  >       
  > feature : (기능추가시) [기능 추가 내용]     
  > fix : (버그 수정시) [버그 수정내용]     
  > Docs : (문서작업시)     
  > chore : 기타 수정시     
  >
  > 최대한 짧게 쓰는것이 원칙이며, 언어는 팀이 정하는 언어로 써야한다.      
  > (Lathion Dev Team은 한국어를 원칙으로 한다.)

- checkout 
  > 다른 commit으로 이동하는 것을 의미함.   
  > 보통 작업 변경시 사용.


- **PULL REQUEST** 
  > GITHUB에서 사용!    
  > Lathion Dev Team은 팀원의 작업 branch를 Development branch랑 합칠때, 무조건 github의 PULL REQUEST을 통하여 합칩니다.   
  > 사용방법은, GitHub의 원하는 레포지스트리에 들어가서, Pullrequest를 눌러서 사용하시면 됩니다!

## GIT 전략
<iframe width="560" height="315" src="https://www.youtube.com/embed/EV3FZ3cWBp8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

### GitFlow
- Main branch
  > 공개등에 사용하는 브런치
- Develop Branch
  > 개발에 사용하는 브런치
- feature branch
  > 어떤 한 기능에 사용하는 브런치
- hotfix branch
  > 긴급 복구 브런치
- relase branch
  > 릴리즈 브런치
### Trunk-based
- main branch
- feature branch


등 여러 전략이 있다.
### Lathion Dev Team에서는...
- Main branch
  > Development branch에서 검증이 완료된 branch
- Development branch
  > Feature에서 code review가 완료된 코드.
- Feature branch
  > 만드는 중인 코드        


정도로 운영한다.

# VS에서 깃허브 사용하기
- 시작하기
https://learn.microsoft.com/ko-kr/visualstudio/version-control/git-with-visual-studio?view=vs-2022

- 새로운 브런치(분기) 만들기 
https://learn.microsoft.com/ko-kr/visualstudio/version-control/git-create-branch?view=vs-2022

- 코드 보내기
https://learn.microsoft.com/ko-kr/visualstudio/version-control/git-push-remote?view=vs-2022

# Lathion Dev Team 3월 19일 과제
- 위의 글을 모두 참고하여, 다음주 일요일까지 아래의 레포지스트리에 있는 과제를 해결하고, Pull request를 진행하세요.
- **모르는게 있거나 막힌다면 팀장에게 바로바로 물어보세요!**

https://github.com/Lathion-game-project/Lathon_Cs_training

