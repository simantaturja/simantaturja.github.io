---
title: 'Bloodhound: Gui/Graph Queries'
date: '2020-11-22 15:30:00 -0400'
categories:
  - Resources
  - Bloodhound
tags:
  - Bloodhound
  - Active Directory
published: true
---

**Find All Users with an SPN/Find all Kerberoastable Users**
```
MATCH (n:User)WHERE n.hasspn=true
RETURN n
```


**Find All Users with an SPN/Find all Kerberoastable Users with passwords last set > 5 years ago**
```
MATCH (u:User) WHERE u.hasspn=true AND u.pwdlastset < (datetime().epochseconds - (1825 * 86400)) AND NOT u.pwdlastset IN [-1.0, 0.0]
RETURN u.name, u.pwdlastset order by u.pwdlastset
```


**Find SPNs with keywords (swap SQL with whatever)**
```
MATCH (u:User) WHERE ANY (x IN u.serviceprincipalnames WHERE toUpper(x) CONTAINS 'SQL')RETURN u
```


**Kerberoastable Users with a path to DA**
```
MATCH (u:User {hasspn:true}) MATCH (g:Group) WHERE g.name CONTAINS 'DOMAIN ADMINS' MATCH p = shortestPath( (u)-[*1..]->(g) ) RETURN p
```


**Find workstations a user can RDP into**
```
MATCH p=(g:Group)-[:CanRDP]->(c:Computer) where g.objectid ENDS WITH '-513'  AND NOT c.operatingsystem CONTAINS 'Server' return p
```


**Find servers a user can RDP into**
```
MATCH p=(g:Group)-[:CanRDP]->(c:Computer) where  g.objectid ENDS WITH '-513'  AND c.operatingsystem CONTAINS 'Server' return p   
```


**DA sessions not on a certain group (e.g. domain controllers)**
```
OPTIONAL MATCH (c:Computer)-[:MemberOf]->(t:Group) WHERE NOT t.name = 'DOMAIN CONTROLLERS@TESTLAB.LOCAL' WITH c as NonDC MATCH p=(NonDC)-[:HasSession]->(n:User)-[:MemberOf]->(g:Group {name:”DOMAIN ADMINS@TESTLAB.LOCAL”}) RETURN DISTINCT (n.name) as Username, COUNT(DISTINCT(NonDC)) as Connexions ORDER BY COUNT(DISTINCT(NonDC)) DESC
```


**Find all computers with Unconstrained Delegation**
```
MATCH (c:Computer {unconstraineddelegation:true}) return c
```


**Find unsupported OSs**
```
MATCH (H:Computer) WHERE H.operatingsystem =~ '.*(2000|2003|2008|xp|vista|7|me)*.' RETURN H
```


**Find users that logged in within the last 90 days**
Change 90 to whatever threshold you want.         
```
MATCH (u:User) WHERE u.lastlogon < (datetime().epochseconds - (90 * 86400)) and NOT u.lastlogon IN [-1.0, 0.0] RETURN u
```


**Find users with passwords last set thin the last 90 days**
Change 90 to whatever threshold you want.
```
MATCH (u:User) WHERE u.pwdlastset < (datetime().epochseconds - (90 * 86400)) and NOT u.pwdlastset IN [-1.0, 0.0] RETURN u
```


**Find all sessions any user in a specific domain has**
```
MATCH p=(m:Computer)-[r:HasSession]->(n:User {domain: "TEST.LOCAL"}) RETURN p
```


**View all GPOs**
```
MATCH (n:GPO) return n
```


**View all GPOs that contain a keyword**
```
MATCH (n:GPO) WHERE n.name CONTAINS "SERVER" return n
```


**View all groups that contain the word ‘admin’**
```
MATCH (n:Group) WHERE n.name CONTAINS "ADMIN" return n
```


**Find user that doesn’t require kerberos pre-authentication (aka AS-REP Roasting)**
```
MATCH (u:User {dontreqpreauth: true}) RETURN u
```


**Find a group with keywords**
E.g. SQL ADMINS or SQL 2017 ADMINS      
```
MATCH (g:Group) WHERE g.name =~ '(?i).SQL.ADMIN.*' RETURN g
```


**Show all high value target group**
```
MATCH p=(n:User)-[r:MemberOf*1..]->(m:Group {highvalue:true}) RETURN p
```


**Shortest paths to Domain Admins group from computers**
```
MATCH (n:Computer),(m:Group {name:'DOMAIN ADMINS@DOMAIN.GR'}),p=shortestPath((n)-[r:MemberOf|HasSession|AdminTo|AllExtendedRights|AddMember|ForceChangePassword|GenericAll|GenericWrite|Owns|WriteDacl|WriteOwner|CanRDP|ExecuteDCOM|AllowedToDelegate|ReadLAPSPassword|Contains|GpLink|AddAllowedToAct|AllowedToAct*1..]->(m)) RETURN p
```


**Shortest paths to Domain Admins group from computers excluding potential DCs (based on ldap/ and GC/ spns)**
```
WITH '(?i)ldap/.*' as regex_one WITH '(?i)gc/.*' as regex_two MATCH (n:Computer) WHERE NOT ANY(item IN n.serviceprincipalnames WHERE item =~ regex_two OR item =~ regex_two ) MATCH(m:Group {name:"DOMAIN ADMINS@DOMAIN.GR"}),p=shortestPath((n)-[r:MemberOf|HasSession|AdminTo|AllExtendedRights|AddMember|ForceChangePassword|GenericAll|GenericWrite|Owns|WriteDacl|WriteOwner|CanRDP|ExecuteDCOM|AllowedToDelegate|ReadLAPSPassword|Contains|GpLink|AddAllowedToAct|AllowedToAct*1..]->(m)) RETURN p
```


**Shortest paths to Domain Admins group from all domain groups (fix-it)**
```
MATCH (n:Group),(m:Group {name:'DOMAIN ADMINS@DOMAIN.GR'}),p=shortestPath((n)-[r:MemberOf|HasSession|AdminTo|AllExtendedRights|AddMember|ForceChangePassword|GenericAll|GenericWrite|Owns|WriteDacl|WriteOwner|CanRDP|ExecuteDCOM|AllowedToDelegate|ReadLAPSPassword|Contains|GpLink|AddAllowedToAct|AllowedToAct*1..]->(m)) RETURN p
```


**Shortest paths to Domain Admins group from non-privileged groups (AdminCount=false)**
```
MATCH (n:Group {admincount:false}),(m:Group {name:'DOMAIN ADMINS@DOMAIN.GR'}),p=shortestPath((n)-[r:MemberOf|HasSession|AdminTo|AllExtendedRights|AddMember|ForceChangePassword|GenericAll|GenericWrite|Owns|WriteDacl|WriteOwner|CanRDP|ExecuteDCOM|AllowedToDelegate|ReadLAPSPassword|Contains|GpLink|AddAllowedToAct|AllowedToAct*1..]->(m)) RETURN p
```


**Shortest paths to Domain Admins group from the Domain Users group**
```
MATCH (g:Group) WHERE g.name =~ 'DOMAIN USERS@.*' MATCH (g1:Group) WHERE g1.name =~ 'DOMAIN ADMINS@.*' OPTIONAL MATCH p=shortestPath((g)-[r:MemberOf|HasSession|AdminTo|AllExtendedRights|AddMember|ForceChangePassword|GenericAll|GenericWrite|Owns|WriteDacl|WriteOwner|CanRDP|ExecuteDCOM|AllowedToDelegate|ReadLAPSPassword|Contains|GpLink|AddAllowedToAct|AllowedToAct|SQLAdmin*1..]->(g1)) RETURN p
```


**Find interesting privileges/ACEs that have been configured to DOMAIN USERS group**
```
MATCH (m:Group) WHERE m.name =~ 'DOMAIN USERS@.*' MATCH p=(m)-[r:Owns|:WriteDacl|:GenericAll|:WriteOwner|:ExecuteDCOM|:GenericWrite|:AllowedToDelegate|:ForceChangePassword]->(n:Computer) RETURN p
```


**Shortest paths to Domain Admins group from non privileged users (AdminCount=false)**
```
MATCH (n:User {admincount:false}),(m:Group {name:'DOMAIN ADMINS@DOMAIN.GR'}),p=shortestPath((n)-[r:MemberOf|HasSession|AdminTo|AllExtendedRights|AddMember|ForceChangePassword|GenericAll|GenericWrite|Owns|WriteDacl|WriteOwner|CanRDP|ExecuteDCOM|AllowedToDelegate|ReadLAPSPassword|Contains|GpLink|AddAllowedToAct|AllowedToAct*1..]->(m)) RETURN p
```


**Find all Edges that a specific user has against all the nodes (HasSession is not calculated, as it is an edge that comes from computer to user, not from user to computer)**
```
MATCH (n:User) WHERE n.name =~ 'HELPDESK@DOMAIN.GR'MATCH (m) WHERE NOT m.name = n.name MATCH p=allShortestPaths((n)-[r:MemberOf|HasSession|AdminTo|AllExtendedRights|AddMember|ForceChangePassword|GenericAll|GenericWrite|Owns|WriteDacl|WriteOwner|CanRDP|ExecuteDCOM|AllowedToDelegate|ReadLAPSPassword|Contains|GpLink|AddAllowedToAct|AllowedToAct|SQLAdmin*1..]->(m)) RETURN p
```


**Find all the Edges that any UNPRIVILEGED user (based on the admincount:False) has against all the nodes**
```
MATCH (n:User {admincount:False}) MATCH (m) WHERE NOT m.name = n.name MATCH p=allShortestPaths((n)-[r:MemberOf|HasSession|AdminTo|AllExtendedRights|AddMember|ForceChangePassword|GenericAll|GenericWrite|Owns|WriteDacl|WriteOwner|CanRDP|ExecuteDCOM|AllowedToDelegate|ReadLAPSPassword|Contains|GpLink|AddAllowedToAct|AllowedToAct|SQLAdmin*1..]->(m)) RETURN p
```


**Find interesting edges related to “ACL Abuse” that uprivileged users have against other users**
```
MATCH (n:User {admincount:False}) MATCH (m:User) WHERE NOT m.name = n.name MATCH p=allShortestPaths((n)-[r:AllExtendedRights|ForceChangePassword|GenericAll|GenericWrite|Owns|WriteDacl|WriteOwner*1..]->(m)) RETURN p
```


**Find interesting edges related to “ACL Abuse” that unprivileged users have against computers:**
```
MATCH (n:User {admincount:False}) MATCH p=allShortestPaths((n)-[r:AllExtendedRights|GenericAll|GenericWrite|Owns|WriteDacl|WriteOwner|AdminTo|CanRDP|ExecuteDCOM|ForceChangePassword*1..]->(m:Computer)) RETURN p
```


**Find if unprivileged users have rights to add members into groups**
```
MATCH (n:User {admincount:False}) MATCH p=allShortestPaths((n)-[r:AddMember*1..]->(m:Group)) RETURN p
```


**Find the active user sessions on all domain computers**
```
MATCH p1=shortestPath(((u1:User)-[r1:MemberOf*1..]->(g1:Group))) MATCH p2=(c:Computer)-[*1]->(u1) RETURN p2
```


**Find all the privileges (edges) of the domain users against the domain computers**
Example: CanRDP, AdminTo etc. HasSession edge is not included.            
```
MATCH p1=shortestPath(((u1:User)-[r1:MemberOf*1..]->(g1:Group))) MATCH p2=(u1)-[*1]->(c:Computer) RETURN p2
```


**Find only the AdminTo privileges (edges) of the domain users against the domain computers**
```
MATCH p1=shortestPath(((u1:User)-[r1:MemberOf*1..]->(g1:Group))) MATCH p2=(u1)-[:AdminTo*1..]->(c:Computer) RETURN p2
```


**Find only the CanRDP privileges (edges) of the domain users against the domain computers**
```
MATCH p1=shortestPath(((u1:User)-[r1:MemberOf*1..]->(g1:Group))) MATCH p2=(u1)-[:CanRDP*1..]->(c:Computer) RETURN p2
```


**Display in BH a specific user with constrained deleg and his targets where he allowed to delegate**
```
MATCH (u:User {name:'USER@DOMAIN.GR'}),(c:Computer),p=((u)-[r:AllowedToDelegate]->(c)) RETURN p
```
