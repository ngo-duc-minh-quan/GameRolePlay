        // ==================== ARC & FARMING SYSTEM ====================
        function openArcSelection() {
            const grid = getEl('arc-grid');
            grid.innerHTML = Object.values(ARCS_CONFIG).map(arc => {
                const locked = arc.levelRequired > gameState.player.level;
                return `<div class="card-item ${locked ? 'locked' : ''}" onclick="${locked ? '' : `selectArc('${arc.id}')`}">
                    <h3 style="color: var(--accent);">${arc.name}</h3>
                    <p style="font-size: 11px; color: #aaa;">Yêu cầu: Level ${arc.levelRequired}</p>
                    <div style="font-size: 11px; margin-top: 5px;">
                        <div style="color: #ff6666;">Quái: ${arc.creeps[0].hp}-${arc.creeps[arc.creeps.length-1].hp} HP</div>
                        <div style="color: #ff0000;">Boss: ${arc.boss.hp} HP</div>
                    </div>
                </div>`;
            }).join('');
            openModal('arc-select-modal');
        }

        function selectArc(arcId) {
            gameState.selectedArc = ARCS_CONFIG[arcId];
            gameState.player.currentArc = arcId;
            gameState.player.arcProgress = { currentWave: 0, totalWaves: 10, bossDefeated: false };
            addLog("📜 ARC", `Bắt đầu ${gameState.selectedArc.name}!`, 'info');
            closeModal('arc-select-modal');
        }

        function openFarmModal() {
            const grid = getEl('farm-grid');
            grid.innerHTML = FARMING_ZONES.map(z => {
                const locked = z.reqLevel > gameState.player.level;
                return `<div class="card-item farm-card ${locked ? 'locked' : ''}" onclick="${locked ? '' : `startFarming('${z.id}')`}">
                    <div style="font-size: 40px;">${z.emoji}</div>
                    <h3 style="color: #44ff44;">${z.name}</h3>
                    <p style="font-size: 11px; color: #aaa;">Level ${z.reqLevel}</p>
                    <div style="font-size: 11px; margin-top: 5px;">
                        <div style="color: #ff6666;">HP: ${z.hpRange[0]}-${z.hpRange[1]}</div>
                        <div style="color: #ff00ff;">Drop: ${z.apDrop[0]}-${z.apDrop[1]} AP</div>
                        <div style="color: #00ffd2;">Tỉ lệ Anime Skill: ${z.skillDrops.reduce((acc, s) => acc + s.rate*100, 0).toFixed(0)}%</div>
                    </div>
                </div>`;
            }).join('');
            openModal('farm-modal');
        }

        function startFarming(zoneId) {
            const zone = FARMING_ZONES.find(z => z.id === zoneId);
            const hp = Math.floor(Math.random() * (zone.hpRange[1] - zone.hpRange[0]) + zone.hpRange[0]);
            const atk = Math.floor(Math.random() * (zone.atkRange[1] - zone.atkRange[0]) + zone.atkRange[0]);
            
            gameState.currentEnemy = {
                name: `Quái ${zone.name}`, emoji: zone.emoji, hp: hp, maxHp: hp, atk: atk, def: Math.floor(atk/3),
                exp: Math.floor(Math.random() * (zone.expRange[1] - zone.expRange[0]) + zone.expRange[0]),
                gold: Math.floor(Math.random() * (zone.goldRange[1] - zone.goldRange[0]) + zone.goldRange[0]),
                zone: zone, isBoss: false, isFarming: true
            };
            
            gameState.inCombat = true;
            addLog("🌾 FARM", `Bắt đầu cày tại ${zone.name}! Gặp ${gameState.currentEnemy.name} (${hp} HP)`, 'info');
            closeModal('farm-modal');
            startCombatUI();
        }

        function startNextWave() {
            if(!gameState.selectedArc) return;
            const arc = gameState.selectedArc;
            const prog = gameState.player.arcProgress;
            
            if(prog.bossDefeated) { completeArc(); return; }
            if(prog.currentWave >= prog.totalWaves) { spawnBoss(arc); return; }
            
            const c = arc.creeps[Math.floor(Math.random() * arc.creeps.length)];
            const scale = 1 + (prog.currentWave * 0.1);
            
            gameState.currentEnemy = {
                name: c.name, emoji: "👾", hp: Math.floor(c.hp * scale), maxHp: Math.floor(c.hp * scale),
                atk: Math.floor(c.atk * scale), def: Math.floor(c.def * scale), exp: Math.floor(c.exp * scale),
                gold: Math.floor(c.gold * scale), isBoss: false, isFarming: false
            };
            
            gameState.inCombat = true;
            addLog("⚔️ ARC", `Wave ${prog.currentWave + 1}: ${c.name} xuất hiện!`, 'combat');
            startCombatUI();
        }

        function spawnBoss(arc) {
            gameState.currentEnemy = {
                name: arc.boss.name, emoji: "👑", hp: arc.boss.hp, maxHp: arc.boss.hp,
                atk: arc.boss.atk, def: arc.boss.def, exp: arc.boss.exp, gold: arc.boss.gold,
                isBoss: true, isFarming: false, drops: arc.boss.drops
            };
            gameState.inCombat = true;
            addLog("💀 BOSS", `${arc.boss.name} XUẤT HIỆN!!!`, 'boss');
            startCombatUI();
        }

        // ==================== LEVEL UP & UPGRADE ====================
        function checkLevelUp() {
            if(gameState.player.exp >= gameState.player.expToLevel) {
                gameState.player.level++;
                gameState.player.exp -= gameState.player.expToLevel;
                gameState.player.expToLevel = Math.floor(gameState.player.expToLevel * 1.5);
                gameState.player.ap += 5; // Tặng 5 AP
                
                // Tự tăng nhẹ stats cơ bản
                statKeys.forEach(k => gameState.player.stats[k] += (k==='hp'||k==='mp'||k==='sp' ? 10 : 2));
                gameState.player.currentHp = gameState.player.stats.hp;
                gameState.player.currentMp = gameState.player.stats.mp;
                
                addLog("⬆️ LEVEL UP!", `Đạt Level ${gameState.player.level}! Nhận 5 AP.`, 'exp');
            }
        }

        function openUpgradeModal() {
            getEl('upgrade-ap').innerText = gameState.player.ap;
            getEl('upgrade-stats-area').innerHTML = statKeys.map(k => `
                <div style="display:flex; justify-content:space-between; align-items:center; background:#222; padding:8px; margin-bottom:5px; border-radius:5px;">
                    <span style="font-weight:bold; color:var(--color-${k.toLowerCase()})">${k.toUpperCase()}</span>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span style="font-size:16px;">${gameState.player.stats[k]}</span>
                        <button class="stat-btn" style="background:#ff00ff;" onclick="upgradeStat('${k}')" ${gameState.player.ap <= 0 ? 'disabled':''}>+</button>
                    </div>
                </div>
            `).join('');
            openModal('upgrade-modal');
        }

        function upgradeStat(stat) {
            if(gameState.player.ap > 0) {
                gameState.player.ap--;
                gameState.player.stats[stat] += (stat==='hp'||stat==='mp'||stat==='sp' ? 10 : 1);
                if(stat==='hp') gameState.player.currentHp += 10;
                if(stat==='mp') gameState.player.currentMp += 10;
                openUpgradeModal(); // refresh
            }
        }
        // ==================== SAVE / LOAD ====================
        function saveGame() {
            if(!gameState || !gameState.player || !gameState.player.name) return;
            let saves = JSON.parse(localStorage.getItem('mmorpg_arcs_v2_saves') || '{}');
            saves[gameState.player.name] = gameState;
            localStorage.setItem('mmorpg_arcs_v2_saves', JSON.stringify(saves));
            addLog("💾", "Game đã được lưu!", 'system');
        }

        function loadGame() {
            // Không tự động vào game, chỉ chuẩn bị giao diện chọn nhân vật
            renderSelectionScreen();
            showScreen('selection-screen');
            return true;
        }

        // INIT
        window.onload = () => {
            loadGame();
            setInterval(() => { if(gameState && gameState.player && gameState.player.name) saveGame(); }, 60000); // Auto save mỗi phút
        };