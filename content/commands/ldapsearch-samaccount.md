---
title: "LDAPsearch Basic"
date: 2024-05-23T10:00:00Z
command: |
    ldapsearch -H ldap://10.10.10.1 -x -b "DC=domaincontroller,DC=local" 'objectClass=User' sAMAccountName | grep "sAMAccountName" | awk '{print $2}'
tags: ["LDAP", "SAMAccount", "Enumeration", "Windows"]
draft: false
---