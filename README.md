# aatf-app

|Route	|Methode|	type|	Full route	|Description|																					
| --- | --- | --- | --- | --- | 
|`/users/login`	|POST|	JSON	|{{url}}/users/login|	Connexion d'un utilisateur|		
|`/users/logout`|POST|JSON	|{{url}}/users/logout|	Déconnexion|			
|`/users/logoutAll`|	POST|	JSON|	{{url}}/users/logoutAll|	Déconnexion de tous les appareils|																					
|`/users`|	POST|	JSON|	{{url}}/users|	Création d'un nouveau utilisateur	|																				
|`/domaines`|	POST|	JSON|	{{url}}/domaines|	Création d'un nouveau domaine|																					
|`/tables`|	POST|	JSON|	{{url}}/tables|	Création d'une nouvelle table	|																				
|`/processus`|	POST|	JSON|	{{url}}/processus|	Création d'un nouveau Processus|																					
|`/users`|	GET|	JSON|	{{url}}/users	| Affichage de tous les utilisateurs	|																				
|`/users/:id`|	GET	|JSON	|{{url}}/users/5e84d1c841c4063a9fc974c4	|Affichage d'un utilisateur selon son ID de BD|																					
|`/user`|	GET	|JSON|	{{url}}/users?matricule=BCP123|	Affichage d'un utilisateur selon son matricule|																					
|`/users/me`|	GET	|JSON|	{{url}}/users/me|	Affichage des informations du profil connecté		|																			
|`/domaines`|	GET	|JSON	|{{url}}/domaines|	Affichage de tous les domaines|																					
|`/domaines/:id`|	GET	|JSON	|{{url}}/domaines/5e84d26741c4063a9fc974c8|	Affichage d'un domaine selon son ID de BD	|																			
|`/domaine`|	GET	|JSON|	{{url}}/domaine?nameD=domaine3| Affichage d'un domaine selon son nom|																					
|`/tables`|	GET	|JSON|	{{url}}/tables	|Affichage de tous les tables	|																				
|`/tables/:id`|	GET|	JSON|	{{url}}/tables/5e84d2a141c4063a9fc974cd|	Affichage d'une table selon son ID de BD|																					
|`/table`|	GET	|JSON|	{{url}}/table?nameT=table1|	Affichage d'une table selon son nom|	
|`/processus`|	GET|	JSON|	{{url}}/processus|	Affichage de tous les processus|																					
|`/processus/:id`|	GET|	JSON|	{{url}}/processus/5e80e28deacde2823d81bdf1|	Affichage d'un processus selon son ID de BD|																					
|`/processusn`|	GET	|JSON	|{{url}}/processusn?nameP=processus1|	Affichage d'un processus selon son nom|																					
|`/users/:id`|	PATCH	|JSON|	{{url}}/users/5e73ce943c652003a1bc3a86|	Modifier les infos d'un utilisateur selon son ID de BD|																					
|`/user`|	PATCH	|JSON|	{{url}}/user?matricule=BCP123	|Modifier les infos d'un utilisateur selon son matricule|																					
|`/domaines/:id`|	PATCH|	JSON|	{{url}}/domaines/5e84d26741c4063a9fc974c8|	Modifier le nom ou la description d'un domaine selon son ID de BD	|																				
|`/addTabToDomaines/:id`|	PATCH|	JSON|	{{url}}/addTabToDomaines/5e84d26741c4063a9fc974c8|	Ajouter un ou plusieurs tableaux à un domaine selon son ID|																					
|`/addProcToDomaines/:id`|	PATCH	|JSON	|{{url}}/addProcToDomaines/5e84d26741c4063a9fc974c8|	Ajouter un ou plusieurs processus à un domaine selon son ID	|																				
|`/removeTabFrmDomaines/:id`|	PATCH	|JSON|	{{url}}/removeTabFrmDomaines/5e84d26741c4063a9fc974c8|	Retirer un ou plusieurs tables d'un domaine selon son ID|																					
|`/removeProcFrmDomaines/:id`|	PATCH|	JSON	|{{url}}/removeProcFrmDomaines/5e84d26741c4063a9fc974c8	|Retirer un ou plusieurs processus d'un domaine selon son ID|																					
