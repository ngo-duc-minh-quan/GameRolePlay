        // ==================== COMBAT & ANIMATION SYSTEM ====================
        function startCombatUI() {
            getEl('combat-scene').style.display = 'block';
            getEl('cb-player-img').src = gameState.player.avatar;
            getEl('cb-player-name').innerText = gameState.player.name;
            getEl('cb-enemy-img').innerText = gameState.currentEnemy.emoji;
            getEl('cb-enemy-name').innerText = gameState.currentEnemy.name;
            updateCombatBars();
            updateGameUI();
        }

        function updateCombatBars() {
            if(!gameState.inCombat) { getEl('combat-scene').style.display = 'none'; return; }
            getEl('cb-player-hp').style.width = `${(gameState.player.currentHp / gameState.player.stats.hp) * 100}%`;
            getEl('cb-enemy-hp').style.width = `${(gameState.currentEnemy.hp / gameState.currentEnemy.maxHp) * 100}%`;
        }

        function triggerAnim(target, animClass) {
            const el = getEl(target === 'player' ? 'fighter-player' : 'fighter-enemy');
            el.classList.remove(animClass);
            void el.offsetWidth; // trigger reflow
            el.classList.add(animClass);
            setTimeout(() => el.classList.remove(animClass), 500);
        }

        function showFloatingDmg(target, dmg, isCrit = false, isHeal = false) {
            const elId = target === 'player' ? 'dmg-player' : 'dmg-enemy';
            const el = getEl(elId);
            el.innerText = isHeal ? `+${dmg}` : `-${dmg}`;
            el.style.color = isHeal ? '#44ff44' : (isCrit ? '#ffaa00' : (target==='player' ? '#ff3e3e' : '#ffffff'));
            el.style.display = 'block';
            el.classList.remove('floating-text');
            void el.offsetWidth;
            el.classList.add('floating-text');
            setTimeout(() => el.style.display = 'none', 1000);
        }

        function showSkillFx(fxEmoji) {
            const el = getEl('skill-fx');
            el.innerText = fxEmoji;
            el.classList.remove('anim-skill');
            void el.offsetWidth;
            el.classList.add('anim-skill');
        }

        function attack() {
            if(!gameState.inCombat || gameState.actionLocked) return;
            gameState.actionLocked = true;
            updateActionBar();
            const p = gameState.player;
            const e = gameState.currentEnemy;
            
            triggerAnim('player', 'anim-attack-right');
            setTimeout(() => {
                let dmg = p.stats.atk + Math.floor(p.stats.str * 1.5); // Sửa lỗi dame không tăng theo chỉ số
                if(p.buffs.gear2) dmg *= 3; // Gear 2 buff
                
                let isCrit = Math.random() < (p.stats.critR / 100);
                if(isCrit) dmg = Math.floor(dmg * (1 + p.stats.critD / 100));
                
                dmg = Math.max(1, dmg - Math.floor(e.def * 0.4));
                e.hp = Math.max(0, e.hp - dmg);
                
                triggerAnim('enemy', 'anim-hit');
                showFloatingDmg('enemy', dmg, isCrit);
                addLog("⚔️", isCrit ? `CHÍ MẠNG! Gây ${dmg} sát thương lên ${e.name}!` : `Tấn công gây ${dmg} sát thương.`, 'combat');
                
                updateCombatBars();
                if(e.hp <= 0) enemyDefeated(); else setTimeout(enemyTurn, 800);
            }, 300);
        }

        function openSkillsModal() {
            const list = getEl('skills-list');
            if(gameState.player.learnedSkills.length === 0) {
                list.innerHTML = '<p style="text-align:center; color:#aaa;">Chưa học kỹ năng nào. Hãy cày quái để rớt bí kíp!</p>';
            } else {
                list.innerHTML = gameState.player.learnedSkills.map(sId => {
                    const s = ANIME_SKILLS[sId];
                    return `<div class="skill-item">
                        <div><strong style="color:#00ffd2;">${s.emoji} ${s.name}</strong> <span style="font-size:10px; color:#aaa;">(${s.origin})</span><br>
                        <small>${s.desc}</small> <span style="color:#00a2ff; font-weight:bold;">${s.mpCost} MP</span></div>
                        ${gameState.inCombat ? `<button class="action-btn" style="background:#00ffd2; color:black;" onclick="useSkill('${sId}')" ${gameState.player.currentMp < s.mpCost ? 'disabled':''}>DÙNG</button>` : ''}
                    </div>`;
                }).join('');
            }
            openModal('skills-modal');
        }

        function useSkill(skillId) {
            closeModal('skills-modal');
            if(!gameState.inCombat || gameState.actionLocked) return;
            
            const s = ANIME_SKILLS[skillId];
            if(gameState.player.currentMp < s.mpCost) { addLog("⚠️", "Không đủ MP!", 'system'); return; }
            
            gameState.actionLocked = true;
            updateActionBar();
            gameState.player.currentMp -= s.mpCost;
            addLog("🌀", `${gameState.player.name} dùng kỹ năng: ${s.name}!!!`, 'skill');
            
            triggerAnim('player', 'anim-attack-right');
            showSkillFx(s.fx);
            
            setTimeout(() => {
                const dmg = Math.floor(s.effect(gameState.player, gameState.currentEnemy));
                if(dmg > 0) {
                    gameState.currentEnemy.hp = Math.max(0, gameState.currentEnemy.hp - dmg);
                    triggerAnim('enemy', 'anim-hit');
                    showFloatingDmg('enemy', dmg, false);
                    addLog("💥", `Gây ${dmg} sát thương!`, 'combat');
                }
                
                updateCombatBars();
                if(gameState.currentEnemy.hp <= 0) enemyDefeated(); else setTimeout(enemyTurn, 1000);
            }, 500);
        }

        function defend() {
            if(!gameState.inCombat || gameState.actionLocked) return;
            gameState.actionLocked = true;
            updateActionBar();
            gameState.player.buffs.defending = true;
            const heal = Math.floor(gameState.player.stats.hp * 0.05);
            gameState.player.currentHp = Math.min(gameState.player.stats.hp, gameState.player.currentHp + heal);
            showFloatingDmg('player', heal, false, true);
            addLog("🛡️", "Phòng thủ! Giảm sát thương và hồi 5% HP.", 'info');
            updateCombatBars();
            setTimeout(enemyTurn, 500);
        }

        function enemyTurn() {
            if(!gameState.inCombat || !gameState.currentEnemy) {
                gameState.actionLocked = false;
                updateActionBar();
                return;
            }
            const p = gameState.player;
            const e = gameState.currentEnemy;
            
            triggerAnim('enemy', 'anim-attack-left');
            
            setTimeout(() => {
                if(p.buffs.infinity) {
                    p.buffs.infinity = 0;
                    addLog("🌌", "Vô hạn (Infinity) đã chặn đứng sát thương!", 'skill');
                    showFloatingDmg('player', 0);
                    gameState.actionLocked = false;
                    return updateGameUI();
                }
                if(p.buffs.dodgeNext) {
                    p.buffs.dodgeNext = false;
                    addLog("👤", "Shadow Step giúp bạn né đòn hoàn hảo!", 'skill');
                    showFloatingDmg('player', 'NÉ');
                    gameState.actionLocked = false;
                    return updateGameUI();
                }

                let dmg = e.atk;
                dmg = Math.max(1, dmg - Math.floor(p.stats.def * 0.3));
                if(p.buffs.defending) { dmg = Math.floor(dmg * 0.5); p.buffs.defending = false; }
                
                if(e.isBoss && Math.random() < 0.2) {
                    dmg = Math.floor(dmg * 1.5);
                    addLog("💀", `${e.name} tung ĐÒN CHÍ MẠNG gây ${dmg} sát thương!`, 'boss');
                    getEl('combat-scene').classList.add('anim-shake');
                    setTimeout(() => getEl('combat-scene').classList.remove('anim-shake'), 400);
                } else {
                    addLog("👊", `${e.name} tấn công gây ${dmg} sát thương!`, 'combat');
                }
                
                p.currentHp -= dmg;
                triggerAnim('player', 'anim-hit');
                showFloatingDmg('player', dmg);
                updateCombatBars();
                
                // Trừ lượt buff
                if(p.buffs.gear2) p.buffs.gear2--;
                
                if(p.currentHp <= 0) { p.currentHp = 0; playerDefeated(); }
                gameState.actionLocked = false;
                updateGameUI();
            }, 300);
        }

        function enemyDefeated() {
            const e = gameState.currentEnemy;
            gameState.player.exp += e.exp;
            gameState.player.gold += e.gold;
            gameState.actionLocked = false;
            
            addLog("🎉", `Đánh bại ${e.name}! Nhận ${e.exp} EXP, ${e.gold} Gold.`, 'exp');
            
            if(e.isFarming) {
                const apDrop = Math.floor(Math.random() * (e.zone.apDrop[1] - e.zone.apDrop[0]) + e.zone.apDrop[0]);
                gameState.player.ap += apDrop;
                addLog("✨", `Rớt ${apDrop} AP!`, 'farm');
                
                e.zone.skillDrops.forEach(drop => {
                    if(Math.random() < drop.rate && !gameState.player.learnedSkills.includes(drop.id)) {
                        gameState.player.learnedSkills.push(drop.id);
                        const sName = ANIME_SKILLS[drop.id].name;
                        addLog("🌀 QUÝ HIẾM", `Bạn nhặt được Bí Kíp: ${sName}!!!`, 'skill');
                    }
                });
            } else {
                if(e.isBoss) {
                    gameState.player.arcProgress.bossDefeated = true;
                    if(e.drops) { e.drops.forEach(d => { gameState.player.inventory.push(d); addLog("🎁", `Nhặt được: ${d}`, 'loot'); }); }
                } else {
                    gameState.player.arcProgress.currentWave++;
                    const r = Math.random();
                    if(r < 0.1) {
                        gameState.player.inventory.push("hp_small");
                        addLog("🎁", `Nhặt được: Bình HP Nhỏ`, 'loot');
                    } else if (r < 0.2) {
                        gameState.player.inventory.push("mp_small");
                        addLog("🎁", `Nhặt được: Bình MP Nhỏ`, 'loot');
                    } else if (r < 0.25 && gameState.selectedArc && gameState.selectedArc.rewards.item) {
                        const arcEq = gameState.selectedArc.rewards.item;
                        gameState.player.inventory.push(arcEq);
                        addLog("🎁", `Tuyệt vời! Nhặt được trang bị hiếm: ${arcEq}`, 'loot');
                    }
                }
            }
            
            gameState.inCombat = false;
            gameState.currentEnemy = null;
            getEl('combat-scene').style.display = 'none';
            checkLevelUp();
            updateGameUI();
        }

        function playerDefeated() {
            addLog("💀 THẤT BẠI", "Bạn đã bị đánh bại...", 'combat');
            gameState.player.gold = Math.max(0, Math.floor(gameState.player.gold * 0.9));
            gameState.player.currentHp = Math.floor(gameState.player.stats.hp * 0.5);
            gameState.inCombat = false;
            gameState.currentEnemy = null;
            gameState.actionLocked = false;
            getEl('combat-scene').style.display = 'none';
            updateGameUI();
        }

        function completeArc() {
            const arc = gameState.selectedArc;
            gameState.player.exp += arc.rewards.exp;
            gameState.player.gold += arc.rewards.gold;
            gameState.player.inventory.push(arc.rewards.item);
            gameState.player.completedArcs.push(arc.id);
            gameState.player.currentArc = null;
            gameState.selectedArc = null;
            
            addLog("🏆 HOÀN THÀNH ARC!", `${arc.name} đã được chinh phục!`, 'arc');
            checkLevelUp();
            updateGameUI();
        }
