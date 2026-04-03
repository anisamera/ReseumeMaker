// templates.js - Extracted Template Engine for ResumeMaker

window.TemplateEngine = {
    // Utility to parse bullets
    bullets: function(text) {
        if(!text) return '';
        // Split by lines and remove completely empty whitespace lines ONLY at the end
        let lines = text.split('\n');
        // If it's just one line and no bullet, return as plain text
        if(lines.length === 1 && !lines[0].trim().startsWith('•')) return `<div class="cv-desc">${lines[0]}</div>`;
        
        // Otherwise, render as a list
        return `<div class="cv-desc"><ul>${lines.map(l => {
            let content = l.replace(/^•?/,'').trim();
            // If the line had a bullet but no content, show a non-breaking space to keep the bullet visible in preview
            return `<li>${content || '&nbsp;'}</li>`;
        }).join('')}</ul></div>`;
    },

    // Theme 1: Clean Minimalist M-ATS (The Original Layout)
    'clean-minimalist': function(d, contactStr) {
        return `
            <style>
                .theme-clean { font-family: 'Inter', Arial, sans-serif; color: #1f2937; padding: 50px; background: white; }
                .theme-clean .cv-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #E5E7EB; padding-bottom: 25px; margin-bottom: 30px; }
                .theme-clean .cv-name { font-size: 28px; font-weight: 800; color: #111; text-transform: uppercase; margin: 0 0 6px 0; letter-spacing: -0.5px; }
                .theme-clean .cv-title { font-size: 16px; color: #4b5563; font-weight: 600; }
                .theme-clean .cv-contact { font-size: 13px; color: #6b7280; margin-top: 10px; }
                .theme-clean .cv-photo { width: 3.5cm; height: 4.5cm; background-size: cover; background-position: center top; border-radius: 6px; border: 1px solid #d1d5db; }
                .theme-clean .cv-section { margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #f3f4f6; }
                .theme-clean .cv-section:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
                .theme-clean .cv-section-title { font-size: 14px; font-weight: 700; color: #111827; text-transform: uppercase; margin-bottom: 18px; letter-spacing: 1px; }
                .theme-clean .cv-item { margin-bottom: 20px; }
                .theme-clean .cv-item-header { display: flex; justify-content: space-between; align-items: baseline; gap: 20px; margin-bottom: 4px; }
                .theme-clean .cv-item-title { font-size: 14px; font-weight: 700; color: #1f2937; }
                .theme-clean .cv-item-sub { font-size: 13px; color: #4b5563; font-weight: 500; margin-top: 2px; }
                .theme-clean .cv-item-date { font-size: 13px; color: #6b7280; font-weight: 500; }
                .theme-clean .cv-desc { font-size: 13px; color: #374151; line-height: 1.6; margin-top: 8px; }
                .theme-clean .cv-desc ul { margin: 4px 0 0 0; padding-left: 20px; }
                .theme-clean .cv-tag { display: inline-block; font-size: 12px; font-weight: 500; background: #f3f4f6; color: #374151; padding: 6px 12px; border-radius: 6px; border: 1px solid #e5e7eb; margin: 0 8px 8px 0; }
                .theme-clean .ref-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 10px; }
            </style>
            <div class="theme-clean">
                <div class="cv-header">
                    <div>
                        <div class="cv-name">${d.personal.name || 'NAMA ANDA'}</div>
                        <div class="cv-title">${d.personal.title || 'Headline Profesional'}</div>
                        <div class="cv-contact">${contactStr.join(' &nbsp;|&nbsp; ')}</div>
                    </div>
                </div>
                ${d.summary.text ? `<div class="cv-section"><div class="cv-section-title">RINGKASAN PROFESIONAL</div><div class="cv-desc">${d.summary.text}</div></div>` : ''}
                ${d.experience.length ? `<div class="cv-section"><div class="cv-section-title">PENGALAMAN KERJA</div>${d.experience.map(x => `<div class="cv-item"><div class="cv-item-header"><div><span class="cv-item-title">${x.title}</span><div class="cv-item-sub">${x.company}</div></div><span class="cv-item-date">${x.start} ${x.end?'hingga ':''}${x.end}</span></div>${this.bullets(x.desc)}</div>`).join('')}</div>` : ''}
                ${d.education.length ? `<div class="cv-section"><div class="cv-section-title">PENDIDIKAN</div>${d.education.map(x => `<div class="cv-item"><div class="cv-item-header"><div><span class="cv-item-title">${x.degree}</span><div class="cv-item-sub">${x.institution} ${x.cgpa ? '| CGPA: '+x.cgpa : ''}</div></div><span class="cv-item-date">${x.year}</span></div>${this.bullets(x.desc)}</div>`).join('')}</div>` : ''}
                ${(d.skills.hard.length || d.skills.soft.length) ? `<div class="cv-section"><div class="cv-section-title">KEMAHIRAN UTAMA</div><div>${[...d.skills.hard, ...d.skills.soft].map(s => `<span class="cv-tag">${s}</span>`).join('')}</div></div>` : ''}
                ${d.cert.length ? `<div class="cv-section"><div class="cv-section-title">SIJIL & KURSUS</div>${d.cert.map(x => `<div class="cv-item"><div class="cv-item-header"><div><span class="cv-item-title">${x.name}</span><div class="cv-item-sub">${x.organizer}</div></div><span class="cv-item-date">${x.year}</span></div>${x.desc? `<div class="cv-desc">${x.desc}</div>`:''}</div>`).join('')}</div>` : ''}
                ${d.lang.length ? `<div class="cv-section"><div class="cv-section-title">BAHASA</div><div>${d.lang.map(x => `<span class="cv-tag" style="background:transparent; border:none; padding:0; margin-right:15px;"><strong>${x.name}</strong> (${x.level})</span>`).join('')}</div></div>` : ''}
                ${d.ref.length ? `<div class="cv-section"><div class="cv-section-title">RUJUKAN</div><div class="ref-grid">${d.ref.map(x => `<div><div class="cv-item-title" style="margin-bottom:4px;">${x.name}</div><div class="cv-desc" style="margin:0">${x.pos}<br>${x.company}<br>TEL: ${x.phone}</div></div>`).join('')}</div></div>` : ''}
            </div>
        `;
    },

    // Theme 2: Professional
    'professional': function(d, contactStr) {
        return `
            <style>
                .theme-prof { font-family: 'Arial', sans-serif; background: white; display: flex; flex-direction: column; min-height: 100%; }
                .theme-prof .header { background: #111827; color: white; padding: 40px; text-align: left; }
                .theme-prof .name { font-size: 32px; font-weight: bold; text-transform: uppercase; margin: 0 0 10px 0; color: white; }
                .theme-prof .title { font-size: 16px; color: #9CA3AF; letter-spacing: 1px; }
                .theme-prof .body { display: flex; flex: 1; }
                .theme-prof .left-col { width: 32%; background: #F9FAFB; padding: 30px; border-right: 1px solid #E5E7EB; }
                .theme-prof .right-col { width: 68%; padding: 30px 40px; }
                .theme-prof .sec-title { font-size: 14px; font-weight: bold; color: #111827; text-transform: uppercase; margin: 0 0 15px 0; border-bottom: 2px solid #D1D5DB; padding-bottom: 5px; }
                .theme-prof .info-block { margin-bottom: 25px; }
                .theme-prof .contact-item { font-size: 12px; color: #4B5563; margin-bottom: 8px; word-break: break-all; }
                .theme-prof .skill-item { font-size: 12px; color: #4B5563; margin-bottom: 6px; }
                .theme-prof .item { margin-bottom: 20px; }
                .theme-prof .item-head { display: flex; justify-content: space-between; align-items: baseline; }
                .theme-prof .item-title { font-size: 14px; font-weight: bold; color: #111827; }
                .theme-prof .item-date { font-size: 12px; color: #4B5563; }
                .theme-prof .item-sub { font-size: 13px; color: #111827; font-weight: bold; margin-bottom: 4px; }
                .theme-prof .desc { font-size: 12px; color: #4B5563; line-height: 1.6; }
                .theme-prof .desc ul { margin: 4px 0 0 0; padding-left: 15px; }
            </style>
            <div class="theme-prof">
                <div class="header">
                    <div class="name">${d.personal.name || 'NAMA ANDA'}</div>
                    <div class="title">${d.personal.title || 'Headline Profesional'}</div>
                </div>
                <div class="body">
                    <div class="left-col">
                        <div class="info-block">
                            <h3 class="sec-title">Contact</h3>
                            ${d.personal.phone ? `<div class="contact-item">${d.personal.phone}</div>` : ''}
                            ${d.personal.email ? `<div class="contact-item">${d.personal.email}</div>` : ''}
                            ${d.personal.location ? `<div class="contact-item">${d.personal.location}</div>` : ''}
                            ${d.personal.link ? `<div class="contact-item">${d.personal.link}</div>` : ''}
                        </div>
                        ${(d.skills.hard.length || d.skills.soft.length) ? `
                        <div class="info-block">
                            <h3 class="sec-title">Kemahiran</h3>
                            ${[...d.skills.hard, ...d.skills.soft].map(s => `<div class="skill-item">• ${s}</div>`).join('')}
                        </div>` : ''}
                        ${d.lang.length ? `
                        <div class="info-block">
                            <h3 class="sec-title">Bahasa</h3>
                            ${d.lang.map(x => `<div class="skill-item">${x.name} (${x.level})</div>`).join('')}
                        </div>` : ''}
                        ${d.personal.photo ? `<img src="${d.personal.photo}" style="width:100px; height:auto; border-radius:4px; border:1px solid #ccc; margin-top:20px;">` : ''}
                    </div>
                    <div class="right-col">
                        ${d.summary.text ? `
                        <div class="info-block">
                            <h3 class="sec-title">Profil Diri</h3>
                            <div class="desc">${d.summary.text}</div>
                        </div>` : ''}
                        ${d.experience.length ? `
                        <div class="info-block">
                            <h3 class="sec-title">Pengalaman Kerja</h3>
                            ${d.experience.map(x => `<div class="item"><div class="item-head"><div class="item-sub">${x.title}</div><div class="item-date">${x.start} - ${x.end}</div></div><div class="desc" style="margin-bottom:6px;">${x.company}</div>${this.bullets(x.desc)}</div>`).join('')}
                        </div>` : ''}
                        ${d.education.length ? `
                        <div class="info-block">
                            <h3 class="sec-title">Pendidikan</h3>
                            ${d.education.map(x => `<div class="item"><div class="item-head"><div class="item-sub">${x.degree}</div><div class="item-date">${x.year}</div></div><div class="desc">${x.institution} ${x.cgpa ? `<br>CGPA: ${x.cgpa}` : ''}</div>${this.bullets(x.desc)}</div>`).join('')}
                        </div>` : ''}
                        ${d.cert.length ? `
                        <div class="info-block">
                            <h3 class="sec-title">Sijil & Kursus</h3>
                            ${d.cert.map(x => `<div class="item"><div class="item-head"><div class="item-sub">${x.name}</div><div class="item-date">${x.year}</div></div><div class="desc">${x.organizer}</div></div>`).join('')}
                        </div>` : ''}
                        ${d.ref.length ? `
                        <div class="info-block">
                            <h3 class="sec-title">Rujukan</h3>
                            <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">
                                ${d.ref.map(x => `<div class="desc"><strong>${x.name}</strong><br>${x.pos}<br>${x.company}<br>${x.phone}</div>`).join('')}
                            </div>
                        </div>` : ''}
                    </div>
                </div>
            </div>
        `;
    },

    // Theme 3: Fresh Graduate
    'fresh-grad': function(d, contactStr) {
        return `
            <style>
                .theme-fresh { font-family: 'Arial', sans-serif; background: white; padding: 50px; position: relative; }
                .theme-fresh .top-bar { position: absolute; top:0; left:0; right:0; height: 8px; background: #3B82F6; }
                .theme-fresh .header { text-align: center; margin-bottom: 30px; }
                .theme-fresh .photo { width: 90px; height: 90px; border-radius: 50%; object-fit: cover; margin: 0 auto 15px auto; display: block; background: #E5E7EB; border: 3px solid #EFF6FF; }
                .theme-fresh .name { font-size: 24px; font-weight: bold; color: #111; text-transform: uppercase; margin: 0 0 5px 0; }
                .theme-fresh .title { font-size: 14px; color: #2563EB; font-weight: bold; margin-bottom: 8px; }
                .theme-fresh .contact { font-size: 11px; color: #555; border-bottom: 1px solid #E5E7EB; padding-bottom: 15px; }
                .theme-fresh .sec { margin-bottom: 25px; }
                .theme-fresh .sec-title { font-size: 14px; font-weight: bold; color: #111; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
                .theme-fresh .item { margin-bottom: 15px; }
                .theme-fresh .item-title { font-size: 13px; font-weight: bold; color: #333; }
                .theme-fresh .item-sub { font-size: 12px; color: #555; }
                .theme-fresh .item-blue { font-size: 12px; color: #3B82F6; font-weight: bold; }
                .theme-fresh .desc { font-size: 12px; color: #444; line-height: 1.6; margin-top: 5px; }
                .theme-fresh .desc ul { margin: 2px 0 0 0; padding-left: 20px; }
                .theme-fresh .skills-wrapper { display: flex; flex-wrap: wrap; gap: 8px; }
                .theme-fresh .skill-badge { background: #EFF6FF; color: #1E3A8A; padding: 5px 12px; border-radius: 4px; font-size: 11px; font-weight: bold; }
            </style>
            <div class="theme-fresh">
                <div class="top-bar"></div>
                <div class="header">
                    ${d.personal.photo ? `<img src="${d.personal.photo}" class="photo">` : ''}
                    <div class="name">${d.personal.name || 'NAMA ANDA'}</div>
                    <div class="title">${d.personal.title || 'Graduan Muda'}</div>
                    <div class="contact">${contactStr.join(' &nbsp;|&nbsp; ')}</div>
                </div>
                ${d.summary.text ? `<div class="sec"><div class="sec-title">OBJEKTIF / PROFIL</div><div class="desc">${d.summary.text}</div></div>` : ''}
                
                ${d.education.length ? `<div class="sec"><div class="sec-title">PENDIDIKAN UTAMA</div>
                ${d.education.map(x => `<div class="item"><div class="item-title">${x.degree}</div><div class="item-sub">${x.institution} | ${x.year}</div>${x.cgpa ? `<div class="item-blue">CGPA: ${x.cgpa}</div>` : ''}${this.bullets(x.desc)}</div>`).join('')}
                </div>` : ''}

                ${(d.skills.hard.length) ? `<div class="sec"><div class="sec-title">KEMAHIRAN TEKNIKAL</div><div class="skills-wrapper">${d.skills.hard.map(s => `<span class="skill-badge">${s}</span>`).join('')}</div></div>` : ''}
                
                ${(d.skills.soft.length) ? `<div class="sec"><div class="sec-title">KEMAHIRAN INSANIAH</div><div class="skills-wrapper" style="gap:5px;">${d.skills.soft.map(s => `<span style="font-size:12px; color:#444;">• ${s} &nbsp;&nbsp;</span>`).join('')}</div></div>` : ''}
                
                ${d.cert.length ? `<div class="sec"><div class="sec-title">SIJIL & KURSUS</div>
                ${d.cert.map(x => `<div class="item"><div class="item-title">${x.name}</div><div class="item-sub">${x.organizer} | ${x.year}</div></div>`).join('')}
                </div>` : ''}

                ${d.lang.length ? `<div class="sec"><div class="sec-title">BAHASA</div>
                <div class="desc">${d.lang.map(x => `<b>${x.name}</b> (${x.level})`).join(' &nbsp;•&nbsp; ')}</div>
                </div>` : ''}

                ${d.ref.length ? `<div class="sec"><div class="sec-title">RUJUKAN</div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                    ${d.ref.map(x => `<div class="desc"><b>${x.name}</b><br>${x.pos}, ${x.company}<br>${x.phone}</div>`).join('')}
                </div>
                </div>` : ''}
            </div>
        `;
    },

    // Theme 4: Kreatif
    'kreatif': function(d, contactStr) {
        return `
            <style>
                .theme-kreatif { font-family: 'Arial', sans-serif; background: #FAFAFA; display: flex; min-height: 100%; }
                .theme-kreatif .sidebar { width: 35%; background: #10B981; padding: 40px 30px; color: white; display: flex; flex-direction: column; align-items: center; text-align: center; }
                .theme-kreatif .photo { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 4px solid #A7F3D0; margin-bottom: 20px; background: white; }
                .theme-kreatif .name-first { font-size: 26px; font-weight: 800; letter-spacing: 2px; margin-bottom: 0; line-height: 1; }
                .theme-kreatif .name-last { font-size: 26px; font-weight: 300; letter-spacing: 2px; color: #A7F3D0; margin-bottom: 10px; }
                .theme-kreatif .title { font-size: 11px; font-weight: bold; letter-spacing: 1px; color: white; margin-bottom: 30px; border-bottom: 1px solid #34D399; padding-bottom: 10px; width: 100%; }
                .theme-kreatif .side-sec { width: 100%; text-align: left; margin-bottom: 25px; }
                .theme-kreatif .side-title { font-size: 12px; font-weight: bold; color: white; margin-bottom: 15px; letter-spacing: 1px; }
                .theme-kreatif .side-item { font-size: 11px; color: #ECFDF5; margin-bottom: 8px; word-break: break-all; }
                .theme-kreatif .skill-bar { width: 100%; height: 4px; background: #047857; border-radius: 2px; margin-top: 4px; overflow: hidden; }
                .theme-kreatif .skill-fill { height: 100%; background: white; width: 85%; }
                .theme-kreatif .main { width: 65%; padding: 40px; }
                .theme-kreatif .main-sec { margin-bottom: 30px; }
                .theme-kreatif .main-title { font-size: 16px; font-weight: bold; color: #111; letter-spacing: 1px; margin-bottom: 5px; }
                .theme-kreatif .main-line { width: 100%; height: 2px; background: #E5E7EB; margin-bottom: 15px; }
                .theme-kreatif .desc { font-size: 12px; color: #555; line-height: 1.6; }
                .theme-kreatif .item { margin-bottom: 20px; }
                .theme-kreatif .item-title { font-size: 14px; font-weight: bold; color: #333; }
                .theme-kreatif .item-date { font-size: 11px; font-weight: bold; color: #10B981; margin-bottom: 5px; }
                .theme-kreatif .desc ul { margin: 4px 0 0 0; padding-left: 15px; }
            </style>
            <div class="theme-kreatif">
                <div class="sidebar">
                    ${d.personal.photo ? `<img src="${d.personal.photo}" class="photo">` : ''}
                    <div class="name-first">${(d.personal.name || 'NAMA').split(' ')[0]}</div>
                    <div class="name-last">${(d.personal.name || ' ANDA').split(' ').slice(1).join(' ')}</div>
                    <div class="title">${d.personal.title || 'CREATIVE PROFESSIONAL'}</div>
                    
                    <div class="side-sec">
                        <div class="side-title">CONTACT</div>
                        ${d.personal.phone ? `<div class="side-item">${d.personal.phone}</div>` : ''}
                        ${d.personal.email ? `<div class="side-item">${d.personal.email}</div>` : ''}
                        ${d.personal.link ? `<div class="side-item">${d.personal.link}</div>` : ''}
                        ${d.personal.location ? `<div class="side-item">${d.personal.location}</div>` : ''}
                    </div>

                    ${(d.skills.hard.length || d.skills.soft.length) ? `
                    <div class="side-sec">
                        <div class="side-title">EXPERTISE</div>
                        ${[...d.skills.hard, ...d.skills.soft].map(s => `<div class="side-item" style="margin-bottom:12px;">${s}<div class="skill-bar"><div class="skill-fill" style="width:${Math.floor(Math.random() * (95 - 70 + 1) + 70)}%"></div></div></div>`).join('')}
                    </div>` : ''}

                    ${d.lang.length ? `
                    <div class="side-sec">
                        <div class="side-title">BAHASA</div>
                        ${d.lang.map(x => `<div class="side-item">${x.name} (${x.level})</div>`).join('')}
                    </div>` : ''}
                </div>
                <div class="main">
                    ${d.summary.text ? `
                    <div class="main-sec">
                        <div class="main-title">PROFIL DIRI</div>
                        <div class="main-line"></div>
                        <div class="desc">${d.summary.text}</div>
                    </div>` : ''}

                    ${d.experience.length ? `
                    <div class="main-sec">
                        <div class="main-title">PENGALAMAN</div>
                        <div class="main-line"></div>
                        ${d.experience.map(x => `<div class="item"><div class="item-title">${x.title} - ${x.company}</div><div class="item-date">${x.start} - ${x.end}</div>${this.bullets(x.desc)}</div>`).join('')}
                    </div>` : ''}

                ${d.education.length ? `
                    <div class="main-sec">
                        <div class="main-title">PENDIDIKAN</div>
                        <div class="main-line"></div>
                        ${d.education.map(x => `<div class="item"><div class="item-title">${x.degree}</div><div class="desc">${x.institution} (${x.year})<br>${x.cgpa ? `CGPA: ${x.cgpa}` : ''}</div></div>`).join('')}
                    </div>` : ''}

                    ${d.cert.length ? `
                    <div class="main-sec">
                        <div class="main-title">SIJIL & KURSUS</div>
                        <div class="main-line"></div>
                        ${d.cert.map(x => `<div class="item"><div class="item-title">${x.name}</div><div class="desc">${x.organizer} (${x.year})</div></div>`).join('')}
                    </div>` : ''}

                    ${d.ref.length ? `
                    <div class="main-sec">
                        <div class="main-title">RUJUKAN</div>
                        <div class="main-line"></div>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
                            ${d.ref.map(x => `<div class="desc"><strong>${x.name}</strong><br>${x.pos}<br>${x.company}<br>TEL: ${x.phone}</div>`).join('')}
                        </div>
                    </div>` : ''}
                </div>
            </div>
        `;
    },

    // Theme 5: Targeted
    'targeted': function(d, contactStr) {
        return `
            <style>
                .theme-target { font-family: 'Arial', sans-serif; background: white; padding: 50px; }
                .theme-target .header { text-align: center; margin-bottom: 25px; border-bottom: 2px solid #000; padding-bottom: 15px; }
                .theme-target .name { font-size: 22px; font-weight: bold; color: #111; text-transform: uppercase; margin-bottom: 5px; }
                .theme-target .target-job { font-size: 14px; font-weight: bold; color: #6366F1; margin-bottom: 8px; letter-spacing: 1px; }
                .theme-target .contact { font-size: 11px; color: #555; }
                .theme-target .sec { margin-bottom: 20px; }
                .theme-target .sec-title { font-size: 12px; font-weight: bold; color: #111; border-bottom: 1px solid #E5E7EB; padding-bottom: 5px; margin-bottom: 10px; text-transform: uppercase; }
                .theme-target .item { margin-bottom: 15px; display: flex; flex-direction: column; }
                .theme-target .item-head { display: flex; justify-content: space-between; align-items: baseline; }
                .theme-target .item-title { font-size: 13px; font-weight: bold; color: #111; }
                .theme-target .item-right { font-size: 11px; color: #555; text-align: right; }
                .theme-target .desc { font-size: 11px; color: #333; line-height: 1.5; margin-top: 5px;}
                .theme-target .desc ul { margin: 3px 0 0 0; padding-left: 18px; }
                .theme-target .tech-grid { display: grid; grid-template-columns: 120px 1fr; gap: 5px; margin-bottom: 5px; font-size: 11px; }
                .theme-target .tech-label { font-weight: bold; color: #333; }
                .theme-target .tech-val { color: #555; }
            </style>
            <div class="theme-target">
                <div class="header">
                    <div class="name">${d.personal.name || 'NAMA ANDA'}</div>
                    <div class="target-job">TARGET JOB: ${d.personal.title || 'PROFESIONAL'}</div>
                    <div class="contact">${contactStr.join(' | ')}</div>
                </div>
                ${d.summary.text ? `<div class="sec"><div class="sec-title">RINGKASAN KELAYAKAN</div><div class="desc">${d.summary.text}</div></div>` : ''}

                ${d.experience.length ? `<div class="sec"><div class="sec-title">PENGALAMAN RELEVAN</div>
                ${d.experience.map(x => `<div class="item"><div class="item-head"><div class="item-title">${x.title} - ${x.company}</div><div class="item-right">${x.start} - ${x.end}</div></div>${this.bullets(x.desc)}</div>`).join('')}
                </div>` : ''}

                ${(d.skills.hard.length) ? `<div class="sec"><div class="sec-title">KEMAHIRAN TEKNIKAL SPESIFIK</div>
                <div class="tech-grid"><div class="tech-label">Teras Teknikal:</div><div class="tech-val">${d.skills.hard.join(', ')}</div></div>
                ${d.skills.soft.length ? `<div class="tech-grid"><div class="tech-label">Kemahiran Asas:</div><div class="tech-val">${d.skills.soft.join(', ')}</div></div>` : ''}
                </div>` : ''}

                ${d.education.length ? `<div class="sec"><div class="sec-title">PENDIDIKAN RELEVAN</div>
                ${d.education.map(x => `<div><span style="font-size:11px; font-weight:bold; color:#333;">${x.degree}</span><br><span style="font-size:11px; color:#555;">${x.institution} | ${x.year} ${x.cgpa ? '| CGPA: '+x.cgpa : ''}</span></div>`).join('')}
                </div>` : ''}

                ${d.lang.length ? `<div class="sec"><div class="sec-title">BAHASA</div>
                <div class="desc">${d.lang.map(x => `<b>${x.name}</b> (${x.level})`).join(', ')}</div>
                </div>` : ''}

                ${d.cert.length ? `<div class="sec"><div class="sec-title">SIJIL & KURSUS</div>
                ${d.cert.map(x => `<div><span style="font-size:11px; font-weight:bold; color:#333;">${x.name}</span><br><span style="font-size:11px; color:#555;">${x.organizer} | ${x.year}</span></div>`).join('')}
                </div>` : ''}

                ${d.ref.length ? `<div class="sec"><div class="sec-title">RUJUKAN</div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                    ${d.ref.map(x => `<div class="desc"><b>${x.name}</b><br>${x.pos}, ${x.company}<br>${x.phone}</div>`).join('')}
                </div>
                </div>` : ''}
            </div>
        `;
    },

    // Theme 6: Federal / Government
    'federal': function(d, contactStr) {
        return `
            <style>
                .theme-federal { font-family: 'Times New Roman', Times, serif; background: white; padding: 40px; border: 2px solid #ccc; min-height: 1000px; }
                .theme-federal .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; }
                .theme-federal .name { font-size: 18px; font-weight: bold; text-transform: uppercase; margin-bottom: 5px; color: #000; }
                .theme-federal .contact { font-size: 11px; color: #000; }
                .theme-federal .sec { margin-bottom: 25px; }
                .theme-federal .sec-title { font-size: 13px; font-weight: bold; color: #000; border-bottom: 1px solid #000; padding-bottom: 3px; margin-bottom: 10px; text-transform: uppercase; }
                .theme-federal .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 11px; color: #000; }
                .theme-federal .item { margin-bottom: 15px; }
                .theme-federal .item-head { display: flex; justify-content: space-between; align-items: baseline; font-weight: bold; font-size: 12px; color: #000; }
                .theme-federal .item-title { font-weight: bold; font-size: 11px; color: #000; margin-top: 4px; }
                .theme-federal .desc { font-size: 11px; color: #000; line-height: 1.5; margin-top: 5px; }
                .theme-federal .desc ul { margin: 3px 0 0 0; padding-left: 20px; list-style-type: square; }
            </style>
            <div class="theme-federal">
                <div class="header">
                    <div class="name">${d.personal.name || 'NAMA ANDA PENGGUNA TERMA'}</div>
                    <div class="contact">${d.personal.location || 'Alamat tidak diisi'}</div>
                    <div class="contact">${d.personal.phone || '000-00000'} | ${d.personal.email || 'email@email.com'}</div>
                </div>
                
                <div class="sec">
                    <div class="sec-title">MAKLUMAT PERIBADI (RINGKASAN)</div>
                    <div class="desc">${d.summary.text || 'Ringkasan profil...'}</div>
                    <div class="info-grid" style="margin-top:10px;">
                        <div>Jawatan Dipohon: <b>${d.personal.title}</b></div>
                        <div>Kewarganegaraan: <b>Malaysia</b></div>
                    </div>
                </div>

                ${d.education.length ? `<div class="sec"><div class="sec-title">KELULUSAN AKADEMIK</div>
                ${d.education.map(x => `<div class="item"><div class="item-head"><div>${x.institution}</div><div>${x.year}</div></div><div class="item-title">${x.degree} (CGPA: ${x.cgpa || '-'})</div>${x.desc ? `<div class="desc">${x.desc}</div>`:''}</div>`).join('')}
                </div>` : ''}

                ${d.experience.length ? `<div class="sec"><div class="sec-title">PENGALAMAN KERJA / PERKHIDMATAN KHAS</div>
                ${d.experience.map(x => `<div class="item"><div class="item-head"><div>${x.company}</div><div>${x.start} - ${x.end}</div></div><div class="item-title">Jawatan: ${x.title}</div>${this.bullets(x.desc)}</div>`).join('')}
                </div>` : ''}

                ${(d.skills.hard.length || d.skills.soft.length) ? `<div class="sec"><div class="sec-title">KEMAHIRAN / KOMPETENSI AWAM</div>
                <div class="desc">Pengetahuan Spesifik: ${d.skills.hard.join(', ')}<br>Kelebihan Insaniah: ${d.skills.soft.join(', ')}</div></div>` : ''}

                ${d.cert.length ? `<div class="sec"><div class="sec-title">SIJIL RELEVAN</div>
                ${d.cert.map(x => `<div class="item"><div class="item-head"><div>${x.name}</div><div>${x.year}</div></div><div class="item-title">${x.organizer}</div></div>`).join('')}
                </div>` : ''}

                ${d.ref.length ? `<div class="sec"><div class="sec-title">MAKLUMAT RUJUKAN</div>
                ${d.ref.map(x => `<div class="desc"><b>${x.name}</b><br>${x.pos}<br>${x.company}<br>TEL: ${x.phone}</div>`).join('')}
                </div>` : ''}

                ${d.lang.length ? `<div class="sec"><div class="sec-title">BAHASA</div>
                <div class="desc">${d.lang.map(x => `<b>${x.name}</b> (${x.level})`).join(', ')}</div>
                </div>` : ''}
            </div>
        `;
    },

    // Main Renderer
    render: function(stateData, selectedTemplateId) {
        let contactStr = [];
        const d = stateData;
        
        if(d.personal.phone) contactStr.push(d.personal.phone); 
        if(d.personal.email) contactStr.push(d.personal.email); 
        if(d.personal.link) contactStr.push(d.personal.link); 
        if(d.personal.location) contactStr.push(d.personal.location);

        // Fallback to minimal if missing
        const templateKey = this[selectedTemplateId] ? selectedTemplateId : 'clean-minimalist';
        return this[templateKey](d, contactStr);
    }
};
