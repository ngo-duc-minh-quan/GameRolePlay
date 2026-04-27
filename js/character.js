        // ==================== SELECTION & CREATION ====================
        let selectedChar = null;

        function renderSelectionScreen() {
            let saves = JSON.parse(localStorage.getItem('mmorpg_arcs_v2_saves') || '{}');
            const oldSave = localStorage.getItem('mmorpg_arcs_v2_save');
            if (oldSave && Object.keys(saves).length === 0) {
                try {
                    const oldData = JSON.parse(oldSave);
                    if (oldData.player && oldData.player.name) {
                        saves[oldData.player.name] = oldData;
                        localStorage.setItem('mmorpg_arcs_v2_saves', JSON.stringify(saves));
                    }
                } catch(e) {}
            }
            
            const grid = document.querySelector('.char-grid');
            
            let html = `
                <div class="char-item" onclick="selectChar('Lemmings', 'images/Lemmings.webp', {str:98, dex:92, int:55, hp:88, mp:0, sp:90, atk:99, def:88, speed:94, critR:85, critD:85, wis:35})">
                    <img src="images/Lemmings.webp" alt="Lemmings">
                    <div class="name">LEMMINGS</div>
                </div>
                <div class="char-item" onclick="selectChar('Tena Sorimura', 'images/TenaSorimura.webp', {str:45, dex:80, int:85, hp:70, mp:95, sp:65, atk:60, def:50, speed:75, critR:50, critD:85, wis:90})">
                    <img src="images/TenaSorimura.webp" alt="Tena">
                    <div class="name">TENA SORIMURA</div>
                </div>
            `;
            
            for(let name in saves) {
                const s = saves[name].player;
                html += `
                <div class="char-item" onclick="selectSavedChar('${name}')">
                    <img src="${s.avatar}" alt="${name}">
                    <div class="name">${name} (Lv.${s.level})</div>
                </div>
                `;
            }
            
            html += `
                <div class="char-item create-new" onclick="openCreationScreen()">
                    <div class="plus">+</div>
                    <div class="name" style="background: none;">TẠO NHÂN VẬT</div>
                </div>
            `;
            if (grid) grid.innerHTML = html;
        }

        function selectChar(name, img, stats) {
            selectedChar = { name, avatar: img, stats: {...stats} };
            getEl('info-panel').style.display = 'flex';
            getEl('display-name').innerText = name;
            getEl('display-img').src = img;
            
            getEl('stats-area').innerHTML = statKeys.map(k => `
                <div class="stat-row">
                    <div class="stat-label"><span>${k.toUpperCase()}</span><span>${stats[k]}</span></div>
                    <div class="stat-bar-bg"><div class="stat-bar-fill" style="width:${Math.min(100, stats[k])}%; background:var(--color-${k.toLowerCase()})"></div></div>
                </div>
            `).join('');
            
            getEl('btn-start-new').style.display = 'block';
            getEl('btn-start-new').innerText = 'BẮT ĐẦU CHƠI';
            getEl('btn-start-new').style.background = 'var(--accent)';
            getEl('btn-continue').style.display = 'none';
        }

        function selectSavedChar(name) {
            const saves = JSON.parse(localStorage.getItem('mmorpg_arcs_v2_saves') || '{}');
            const state = saves[name];
            if(state) {
                selectedChar = { isSaved: true, name: state.player.name, avatar: state.player.avatar, stats: state.player.stats, savedState: state };
                getEl('info-panel').style.display = 'flex';
                getEl('display-name').innerText = state.player.name + ` (Lv.${state.player.level})`;
                getEl('display-img').src = state.player.avatar;
                getEl('stats-area').innerHTML = statKeys.map(k => `
                    <div class="stat-row">
                        <div class="stat-label"><span>${k.toUpperCase()}</span><span>${state.player.stats[k]}</span></div>
                        <div class="stat-bar-bg"><div class="stat-bar-fill" style="width:${Math.min(100, state.player.stats[k])}%; background:var(--color-${k.toLowerCase()})"></div></div>
                    </div>
                `).join('');
                
                getEl('btn-start-new').style.display = 'block';
                getEl('btn-start-new').innerText = 'CHƠI LẠI TỪ ĐẦU';
                getEl('btn-start-new').style.background = '#ff3333';
                getEl('btn-continue').style.display = 'block';
            }
        }

        function continueGame() {
            if(!selectedChar || !selectedChar.isSaved) return;
            gameState = selectedChar.savedState;
            gameState.actionLocked = false;
            showScreen('game-world');
            updateGameUI();
            addLog("💾", "Tiếp tục cuộc hành trình!", 'system');
        }

        function openCreationScreen() {
            creationPoints = 70;
            statKeys.forEach(k => creationStats[k] = (k==='hp'||k==='mp'||k==='sp' ? 50 : 10)); // base stats
            updateCreationUI();
            showScreen('creation-screen');
        }

        function closeCreationScreen() { showScreen('selection-screen'); }

        function previewAvatar(event) {
            const file = event.target.files[0];
            if(file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = getEl('avatar-preview');
                    img.src = e.target.result;
                    img.style.display = 'block';
                    getEl('avatar-upload-label').querySelector('span').style.display = 'none';
                }
                reader.readAsDataURL(file);
            }
        }

        function updateCreationUI() {
            getEl('creation-points').innerText = creationPoints;
            getEl('creation-stats-area').innerHTML = statKeys.map(k => `
                <div class="stat-edit-row">
                    <span class="stat-edit-name" style="color: var(--color-${k.toLowerCase()})">${k.toUpperCase()}</span>
                    <div class="stat-edit-controls">
                        <button class="stat-btn" onclick="adjStat('${k}', -1)" ${creationStats[k] <= (k==='hp'||k==='mp'||k==='sp'?50:10) ? 'disabled':''}>-</button>
                        <span class="stat-val">${creationStats[k]}</span>
                        <button class="stat-btn" onclick="adjStat('${k}', 1)" ${creationPoints <= 0 ? 'disabled':''}>+</button>
                    </div>
                </div>
            `).join('');
        }

        function adjStat(stat, val) {
            if (val > 0 && creationPoints > 0) { creationStats[stat]++; creationPoints--; }
            else if (val < 0 && creationStats[stat] > (stat==='hp'||stat==='mp'||stat==='sp'?50:10)) { creationStats[stat]--; creationPoints++; }
            updateCreationUI();
        }

        async function finishCreation() {
            const nameInput = getEl('creation-name').value.trim();
            if(!nameInput) { await customAlert("Vui lòng nhập tên nhân vật!"); return; }
            if(creationPoints > 0) { 
                const ans = await customConfirm(`Bạn còn ${creationPoints} điểm chưa dùng. Vẫn tạo?`);
                if(!ans) return; 
            }
            
            let avatarSrc = getEl('avatar-preview').src;
            if(!avatarSrc || avatarSrc === window.location.href) { avatarSrc = 'images/TenaSorimura.webp'; } // fallback image
            
            selectedChar = { name: nameInput, avatar: avatarSrc, stats: {...creationStats} };
            startStory();
        }

        async function startStory(reset = false) {
            if (!selectedChar) return;
            if (reset) {
                const ans = await customConfirm("Bạn có chắc muốn chơi lại từ đầu? Mọi dữ liệu của nhân vật này sẽ bị xóa!", "CẢNH BÁO");
                if(!ans) return;
            }
            
            gameState = getInitialGameState();
            gameState.player.name = selectedChar.name;
            gameState.player.avatar = selectedChar.avatar;
            gameState.player.stats = {...selectedChar.stats};
            gameState.player.currentHp = selectedChar.stats.hp;
            gameState.player.currentMp = selectedChar.stats.mp;
            gameState.player.currentSp = selectedChar.stats.sp;

            showScreen('story-screen');
            getEl('story-title').innerText = "HÀNH TRÌNH BẮT ĐẦU";
            const content = getEl('story-content');
            content.innerHTML = '';
            
            const storyLines = [
                "Thế giới đã thay đổi. Quái vật trỗi dậy khắp nơi.",
                "Hệ thống sức mạnh Anime đã thức tỉnh trong những người được chọn.",
                "Bạn cần phải farm quái, thu thập kỹ năng và tiêu diệt 7 Quỷ Vương.",
                `Sẵn sàng chiến đấu, ${selectedChar.name}?`
            ];
            
            for(let line of storyLines) {
                const p = document.createElement('div'); p.className = 'story-line'; p.innerText = line;
                content.appendChild(p);
                setTimeout(() => p.style.opacity = "1", 100);
                await new Promise(r => setTimeout(r, 1200));
            }
            getEl('next-btn').style.display = 'block';
        }

        function enterGameWorld() {
            showScreen('game-world');
            updateGameUI();
            addLog("HỆ THỐNG", `Chào mừng ${gameState.player.name}! Hệ thống Cày Quái & Anime Skills đã kích hoạt.`, 'info');
            saveGame(); // Lưu nhân vật mới ngay khi vào game
        }
