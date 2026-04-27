        // ==================== SHOP & INVENTORY & EXIT ====================
        function openShopModal() {
            getEl('shop-gold').innerText = gameState.player.gold;
            let html = SHOP_ITEMS.map(item => `
                <div style="display:flex; justify-content:space-between; align-items:center; background:#222; padding:10px; margin-bottom:5px; border-radius:5px; border-left:4px solid #ff44aa;">
                    <div>
                        <strong style="color:white;">${item.emoji} ${item.name}</strong><br>
                        <small style="color:#aaa;">Hồi ${item.val} ${item.type.toUpperCase()}</small>
                    </div>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span style="color:gold; font-weight:bold;">💰 ${item.price}</span>
                        <button class="action-btn" style="background:#ff44aa; color:black; min-width:60px;" onclick="buyItem('${item.id}')" ${gameState.player.gold < item.price ? 'disabled':''}>MUA</button>
                    </div>
                </div>
            `).join('');

            const arcCount = gameState.player.completedArcs.length;
            for(let id in EQUIPMENT_DB) {
                const eq = EQUIPMENT_DB[id];
                if(arcCount >= (eq.reqArc || 0)) {
                    html += `
                    <div style="display:flex; justify-content:space-between; align-items:center; background:#222; padding:10px; margin-bottom:5px; border-radius:5px; border-left:4px solid #ffaa00;">
                        <div>
                            <strong style="color:white;">${eq.emoji} ${eq.name}</strong><br>
                            <small style="color:#aaa;">${eq.desc}</small>
                        </div>
                        <div style="display:flex; align-items:center; gap:10px;">
                            <span style="color:gold; font-weight:bold;">💰 ${eq.price}</span>
                            <button class="action-btn" style="background:#ffaa00; color:black; min-width:60px;" onclick="buyItem('${id}')" ${gameState.player.gold < eq.price ? 'disabled':''}>MUA</button>
                        </div>
                    </div>`;
                }
            }
            getEl('shop-items').innerHTML = html;
            openModal('shop-modal');
        }

        function buyItem(id) {
            const item = SHOP_ITEMS.find(i => i.id === id);
            const eq = EQUIPMENT_DB[id];
            const price = item ? item.price : (eq ? eq.price : 0);
            const name = item ? item.name : (eq ? eq.name : id);
            
            if(gameState.player.gold >= price) {
                gameState.player.gold -= price;
                gameState.player.inventory.push(id);
                addLog("🏪", `Đã mua ${name} (-${price} Gold)`, 'shop');
                openShopModal();
                updateGameUI();
            }
        }

        function openInventoryModal() {
            const list = getEl('inventory-list');
            const inv = gameState.player.inventory;
            const countMap = {};
            inv.forEach(id => { countMap[id] = (countMap[id] || 0) + 1; });
            
            let html = '';
            for(let id in countMap) {
                const item = SHOP_ITEMS.find(i => i.id === id);
                if(item) {
                    html += `
                    <div style="display:flex; justify-content:space-between; align-items:center; background:#222; padding:10px; margin-bottom:5px; border-radius:5px; border-left:4px solid #4488ff;">
                        <div>
                            <strong style="color:white;">${item.emoji} ${item.name} (x${countMap[id]})</strong><br>
                            <small style="color:#aaa;">Hồi ${item.val} ${item.type.toUpperCase()}</small>
                        </div>
                        <button class="action-btn" style="background:#4488ff; color:black; min-width:80px;" onclick="useItemFromInv('${id}')">DÙNG</button>
                    </div>`;
                } else if(EQUIPMENT_DB[id]) {
                    const eq = EQUIPMENT_DB[id];
                    const isEquipped = gameState.player.equipment.weapon === id || gameState.player.equipment.armor === id;
                    html += `
                    <div style="display:flex; justify-content:space-between; align-items:center; background:#222; padding:10px; margin-bottom:5px; border-radius:5px; border-left:4px solid #ffaa00;" title="${eq.desc}">
                        <div>
                            <strong style="color:white;">${eq.emoji} ${eq.name} (x${countMap[id]})</strong><br>
                            <small style="color:#ffaa00;">Trang bị: ${eq.type === 'weapon' ? 'Vũ khí' : 'Áo giáp'}</small><br>
                            <small style="color:#aaa;">${eq.desc}</small>
                        </div>
                        <div>
                            ${isEquipped 
                                ? `<button class="action-btn" style="background:#ff3333; color:white; min-width:80px;" onclick="unequipItem('${id}')">THÁO</button>`
                                : `<button class="action-btn" style="background:#ffaa00; color:black; min-width:80px;" onclick="equipItem('${id}')">TRANG BỊ</button>`}
                        </div>
                    </div>`;
                } else {
                    html += `<div style="padding:10px; background:#222; margin-bottom:5px; border-radius:5px; color:#aaa;">🎁 ${id} (x${countMap[id]})</div>`;
                }
            }
            list.innerHTML = html || '<p style="text-align:center; color:#aaa;">Túi đồ rỗng.</p>';
            openModal('inventory-modal');
        }

        function equipItem(id) {
            const eq = EQUIPMENT_DB[id];
            const p = gameState.player;
            if (p.equipment[eq.type]) {
                unequipItem(p.equipment[eq.type], false); // Tháo trang bị cũ
            }
            p.equipment[eq.type] = id;
            for(let key in eq.stats) {
                if (p.stats[key] !== undefined) p.stats[key] += eq.stats[key];
                if (key === 'hp') p.currentHp += eq.stats[key];
                if (key === 'mp') p.currentMp += eq.stats[key];
                if (key === 'sp') p.currentSp += eq.stats[key];
            }
            addLog("⚔️", `Đã trang bị ${eq.name}!`, 'system');
            openInventoryModal();
            updateGameUI();
        }

        function unequipItem(id, refreshModal = true) {
            const eq = EQUIPMENT_DB[id];
            const p = gameState.player;
            if (p.equipment[eq.type] === id) {
                p.equipment[eq.type] = null;
                for(let key in eq.stats) {
                    if (p.stats[key] !== undefined) p.stats[key] -= eq.stats[key];
                    if (key === 'hp') p.currentHp = Math.max(1, p.currentHp - eq.stats[key]);
                    if (key === 'mp') p.currentMp = Math.max(0, p.currentMp - eq.stats[key]);
                    if (key === 'sp') p.currentSp = Math.max(0, p.currentSp - eq.stats[key]);
                }
                addLog("⚔️", `Đã tháo ${eq.name}!`, 'system');
                if(refreshModal) {
                    openInventoryModal();
                    updateGameUI();
                }
            }
        }

        function useItemFromInv(id) {
            const idx = gameState.player.inventory.indexOf(id);
            if(idx > -1) {
                gameState.player.inventory.splice(idx, 1);
                applyPotion(id);
                openInventoryModal();
            }
        }

        function openPotionModal() {
            if(!gameState.inCombat || gameState.actionLocked) return;
            const list = getEl('potion-list');
            const inv = gameState.player.inventory;
            const countMap = {};
            inv.forEach(id => { if(id.startsWith('hp_') || id.startsWith('mp_')) countMap[id] = (countMap[id] || 0) + 1; });
            
            let html = '';
            for(let id in countMap) {
                const item = SHOP_ITEMS.find(i => i.id === id);
                if(item) {
                    html += `
                    <div style="display:flex; justify-content:space-between; align-items:center; background:#222; padding:10px; margin-bottom:5px; border-radius:5px; border-left:4px solid #ff44aa;">
                        <div>
                            <strong style="color:white;">${item.emoji} ${item.name} (x${countMap[id]})</strong><br>
                            <small style="color:#aaa;">Hồi ${item.val} ${item.type.toUpperCase()}</small>
                        </div>
                        <button class="action-btn" style="background:#ff44aa; color:black; min-width:80px;" onclick="usePotionFromModal('${id}')">DÙNG</button>
                    </div>`;
                }
            }
            list.innerHTML = html || '<p style="text-align:center; color:#aaa;">Không có thuốc trong túi đồ.</p>';
            openModal('potion-modal');
        }

        function usePotionFromModal(id) {
            closeModal('potion-modal');
            if(!gameState.inCombat || gameState.actionLocked) return;
            gameState.actionLocked = true;
            updateActionBar();
            
            const idx = gameState.player.inventory.indexOf(id);
            if(idx > -1) {
                gameState.player.inventory.splice(idx, 1);
                applyPotion(id);
                setTimeout(enemyTurn, 500);
            }
        }

        function applyPotion(id) {
            const item = SHOP_ITEMS.find(i => i.id === id);
            const p = gameState.player;
            if(item.type === 'hp') {
                p.currentHp = Math.min(p.stats.hp, p.currentHp + item.val);
                if(gameState.inCombat) showFloatingDmg('player', item.val, false, true);
                addLog("🧪", `Dùng ${item.name}, hồi ${item.val} HP!`, 'info');
            } else {
                p.currentMp = Math.min(p.stats.mp, p.currentMp + item.val);
                if(gameState.inCombat) showFloatingDmg('player', `${item.val}MP`, false, true);
                addLog("💧", `Dùng ${item.name}, hồi ${item.val} MP!`, 'info');
            }
            updateGameUI();
            if(gameState.inCombat) updateCombatBars();
        }

        async function returnToMenu() {
            const ans = await customConfirm('Bạn có chắc chắn muốn thoát về Menu? Bạn có thể chọn hoặc tạo nhân vật khác.');
            if(ans) {
                saveGame();
                renderSelectionScreen();
                showScreen('selection-screen');
            }
        }

